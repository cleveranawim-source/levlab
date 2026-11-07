"""Detector and optional-PDF regression tests; no running site or content writes."""
import json
from pathlib import Path
import shutil
import tempfile
import unittest
from unittest.mock import patch

from playwright.sync_api import sync_playwright
from PIL import Image
import qa_shots as qa


class DetectorTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch()

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def test_boxes_stage_hidden_nodes_and_failed_images_at_both_scales(self):
        for scale in [1, 0.69]:
            with self.subTest(scale=scale):
                p = self.browser.new_page()
                try:
                    p.route('**/missing.png', lambda route: route.fulfill(status=404, body=''))
                    p.set_content(f'''<style>
                    .slide-page {{ position:absolute;left:13px;top:7px;width:1920px;height:1080px;transform:scale({scale});transform-origin:top left; }}
                    .slide-bottomline {{position:absolute;top:1020px;height:30px;width:1720px;left:100px;}}
                    .slide-pending {{opacity:0}} .sr-only {{position:absolute;width:1px;height:1px;overflow:hidden}}
                    </style><section class="slide-page" id="1">
                    <div class="slide-content">
                    <h2 style="height:20px;width:90px;overflow:hidden;font-size:40px">Long heading wraps past its box</h2>
                    <p class="slide-story-text" style="position:absolute;top:1100px">Outside stage</p>
                    <p hidden style="position:absolute;left:2100px">Hidden question</p>
                    <p class="slide-pending" style="position:absolute;left:2100px">Unrevealed step</p>
                    <p class="sr-only" style="left:2100px">Screen reader label</p>
                    <button class="slide-flip-card is-flipped"><span class="slide-flip-front" style="position:absolute;left:2100px">Hidden front</span><span class="slide-flip-back">Visible back</span></button>
                    <img src="http://localhost/missing.png" width="50" height="50">
                    <video poster="http://localhost/missing.png" width="50" height="50"></video>
                    </div><div class="slide-bottomline">Footer</div></section>''')
                    data = p.evaluate(qa.INSPECT, dict(number=1, spec={'type':'story'}, lesson={'slug':'qa-test'}, nextLesson=None))
                    heading = [i for i in data['overflows'] if i['field']=='heading']
                    self.assertTrue(heading)
                    self.assertIn('vertical_box_overflow', heading[0]['reasons'])
                    story = [i for i in data['overflows'] if i['field']=='story'][0]
                    self.assertIn('outside_stage', story['reasons'])
                    self.assertGreater(story['bounds']['y'], 1080)
                    self.assertGreater(story['overflow_px']['stage_bottom'], 0)
                    self.assertFalse(any(i['text'] in ['Hidden question','Unrevealed step','Screen reader label','Hidden front'] for i in data['overflows']))
                    self.assertEqual({i['reason'] for i in data['missing_images']}, {'image_load_failed','poster_load_failed'})
                finally:
                    p.close()

    def test_declared_but_unrendered_image_and_summary_dedup(self):
        p = self.browser.new_page()
        try:
            p.set_content('<section class="slide-page" id="1" style="width:1920px;height:1080px"><div class="slide-content"><p>Writing frames</p></div><div class="slide-bottomline">Footer</div></section>')
            spec = {'type':'activity','image':{'src':'/images/qa-test.webp'}}
            data = p.evaluate(qa.INSPECT, dict(number=1,spec=spec,lesson={'slug':'qa-test'},nextLesson=None))
            missing = data['missing_images'][0]
            self.assertEqual(missing['reason'], 'declared_image_not_rendered')
            result = {'slide_count':1,'viewports':[{'width':w,'height':h,'slides':[{'slide':1,'builds':[{'build':1,**data},{'build':2,**data}]}]} for w,h in qa.VIEWPORTS]}
            self.assertEqual(qa.summarize(result)['missing_images'], 1)
        finally:
            p.close()


class MediaTests(unittest.TestCase):
    def test_worksheet_cards_cardsets_and_absent_outputs(self):
        sample = qa.PUBLIC / 'files/worksheets/g1-09-worksheet.pdf'
        with tempfile.TemporaryDirectory(prefix='qa-contact-test-') as temp:
            root = Path(temp); public = root/'public'; folder = public/'files/worksheets'; folder.mkdir(parents=True)
            for suffix in ['worksheet','cards','cardsets']:
                shutil.copyfile(sample, folder/f'qa-test-{suffix}.pdf')
            output = root/'evidence'; output.mkdir()
            with patch.object(qa, 'ROOT', root), patch.object(qa, 'PUBLIC', public):
                media = qa.worksheet_shots('qa-test', output)
                self.assertEqual([m['pages'] for m in media], [2,2,2])
                self.assertEqual(len(list((output/'worksheets').glob('*.png'))), 6)
                with Image.open(output/'worksheet.jpg') as im:
                    self.assertGreater(im.height, im.width)
                media = qa.worksheet_shots('missing', output)
                self.assertTrue(all(not m['exists'] for m in media))
                self.assertTrue((output/'worksheet.jpg').is_file())
                (output/'teaser.jpg').write_bytes(b'stale generated evidence')
                self.assertFalse(qa.teaser_shots('missing', output)['exists'])
                self.assertFalse((output/'teaser.jpg').exists())


if __name__ == '__main__':
    unittest.main()
