import Link from "next/link";
import Logo from "./Logo";
import MakerBadge from "./MakerBadge";
import { CONTACT_EMAIL, YOUTUBE_URL, NAV_ITEMS } from "../data/site";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div>
          <Link href="/" className="logo" aria-label="Lev Lab 홈">
            <Logo white />
            <span className="wm">LEV&nbsp;LAB</span>
          </Link>
          <p className="desc">서울 사회정서교육에 맞춘 중학교 SEL 수업과 웹앱을 만드는 교육 콘텐츠 연구소.</p>
          <MakerBadge size="sm" className="foot-maker" />
        </div>
        <div>
          <h2 className="foot-h">둘러보기</h2>
          {NAV_ITEMS.filter(({ path }) => path !== "/contact").map(({ path, label }) => (
            <Link key={path} href={path}>{label}</Link>
          ))}
        </div>
        <div>
          <h2 className="foot-h">연결</h2>
          <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">LevLab 유튜브</a>
          <Link href="/#newsletter">공개 소식 받기</Link>
          <Link href="/contact">문의·협업</Link>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
        <div className="copy">© 2026 Lev Lab. 마음을 읽는 교육. · <Link href="/privacy">개인정보 처리방침</Link></div>
      </div>
    </footer>
  );
}
