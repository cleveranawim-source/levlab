"use client";

import PageShell from "../components/PageShell";
import { CONTACT_EMAIL } from "../data/site";

const TRANSFERS = [
  {
    who: "Formspree, Inc.", where: "미국", contact: "team@formspree.io",
    items: "공개 소식 신청: 이메일 / 문의: 이름·소속(선택)·이메일·문의 내용",
    when: "폼을 제출할 때, 인터넷(암호화된 HTTPS)으로 전송",
    why: "폼 접수·보관과 레브랩 이메일로의 전달",
    keep: "레브랩 보관 기간(아래 1번)이 끝나면 레브랩이 삭제",
  },
  {
    who: "Google LLC (Gmail)", where: "미국", contact: "policies.google.com/privacy",
    items: "Formspree가 전달한 위 폼 내용",
    when: "폼 제출 직후, 이메일로 전송",
    why: "레브랩 대표 메일함에서 문의 확인·회신",
    keep: "레브랩 보관 기간이 끝나면 레브랩이 삭제",
  },
  {
    who: "Vercel Inc.", where: "미국 등 Vercel 서버 지역", contact: "privacy@vercel.com",
    items: "IP 주소, 브라우저 정보, 접속 시각 등 접속 기록",
    when: "웹사이트에 접속할 때마다, 인터넷으로 자동 전송",
    why: "웹사이트 호스팅과 보안",
    keep: "Vercel의 로그 보관 정책에 따름",
  },
];

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Privacy"
      title="개인정보 처리방침"
      sub="레브랩 웹사이트(www.levlab.co.kr)가 어떤 정보를 왜 받고, 어디로 보내고, 언제 어떻게 지우는지 알려 드립니다."
    >
      <div className="policy">
        <p className="meta">시행일 2026년 11월 6일 · 글꼴을 사이트에서 직접 제공하도록 바꾸며 외부 글꼴 서비스(jsDelivr) 이전 항목을 삭제</p>

        <h2>1. 받는 정보, 쓰는 곳, 보관 기간</h2>
        <table>
          <thead><tr><th scope="col">언제</th><th scope="col">받는 정보</th><th scope="col">쓰는 곳</th><th scope="col">보관 기간</th></tr></thead>
          <tbody>
            <tr><td>공개 소식 신청</td><td>이메일 (필수)</td><td>새 수업·콘텐츠 공개 소식 발송</td><td>신청을 철회할 때까지</td></tr>
            <tr><td>문의하기</td><td>이름·이메일·문의 내용 (필수), 소속 (선택)</td><td>문의 확인과 회신</td><td>회신을 마치고 1년</td></tr>
          </tbody>
        </table>
        <p>회원가입은 없습니다. 두 폼 모두 동의를 받은 뒤에만 보내지며, 동의하지 않을 권리가 있습니다. 동의하지 않으시면 소식 발송과 폼 문의 회신을 할 수 없습니다. 위 목적 밖으로는 쓰지 않고, 팔거나 제3자에게 제공하지 않습니다.</p>

        <h2>2. 국외 이전과 처리 위탁</h2>
        <p>레브랩은 아래 해외 서비스를 써서 폼을 받고 웹사이트를 운영합니다.</p>
        <ul>
          <li><b>폼 정보</b>(Formspree, Google): 폼에서 따로 받는 <b>국외 이전 동의</b>를 근거로 이전합니다(개인정보 보호법 제28조의8 제1항 제1호).</li>
          <li><b>접속 기록</b>(Vercel): 웹사이트를 보여 드리기 위한 처리 위탁·보관으로, 이 방침에 공개하는 것을 근거로 합니다(같은 항 제3호). 사이트를 열면 자동으로 전송됩니다.</li>
        </ul>
        <div className="table-scroll" tabIndex={0} role="region" aria-label="국외 이전 받는 곳">
          <table>
            <thead><tr><th scope="col">이전받는 곳 (국가·연락처)</th><th scope="col">이전 항목</th><th scope="col">시기·방법</th><th scope="col">목적</th><th scope="col">보유 기간</th></tr></thead>
            <tbody>
              {TRANSFERS.map((t) => (
                <tr key={t.who}>
                  <td><b>{t.who}</b><br />{t.where} · {t.contact}</td>
                  <td>{t.items}</td><td>{t.when}</td><td>{t.why}</td><td>{t.keep}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>국외 이전을 원하지 않으시면 동의하지 않으시면 됩니다. 이 경우 소식 신청과 폼 문의는 이용할 수 없습니다.</p>

        <h2>3. 지우는 절차와 방법</h2>
        <ul>
          <li>보관 기간이 끝나거나 동의를 철회하시면 지체 없이 지웁니다. 빠진 것이 없는지 분기마다 한 번 더 확인합니다.</li>
          <li>Formspree 접수함과 레브랩 메일함에서 해당 제출과 메일을 삭제하고, 휴지통을 비워 되살릴 수 없게 합니다.</li>
          <li>종이로 출력한 경우에는 분쇄합니다.</li>
        </ul>

        <h2>4. 안전하게 지키는 방법</h2>
        <ul>
          <li>폼과 웹사이트는 모두 암호화된 연결(HTTPS)로만 주고받습니다.</li>
          <li>Formspree와 레브랩 메일 계정은 대표 한 사람만 접근하며, 2단계 인증으로 보호합니다.</li>
          <li>받은 정보를 다른 파일이나 기기로 옮겨 따로 모아 두지 않습니다.</li>
        </ul>

        <h2>5. 정보주체의 권리</h2>
        <p>언제든 내 정보의 열람·정정·삭제·처리 정지, 그리고 동의 철회(소식 그만 받기 포함)를 {CONTACT_EMAIL}로 요청하실 수 있습니다. 확인 후 10일 안에 처리하고 결과를 알려 드립니다. 법정대리인이나 위임을 받은 분도 위임 사실을 알려 주시면 같은 방법으로 요청하실 수 있습니다.</p>

        <h2>6. 브라우저에 저장하는 것</h2>
        <p>밝은·어두운 화면 설정을 기억하기 위해 브라우저 저장소(localStorage)에 <code>levlab-theme</code> 값 하나를 저장합니다. 개인을 알아볼 수 있는 정보는 아니며, 브라우저의 사이트 데이터 삭제로 지울 수 있습니다. 광고·추적 쿠키와 방문 분석 도구는 쓰지 않습니다.</p>

        <h2>7. 만 14세 미만 아동</h2>
        <p>이 웹사이트의 폼은 교사·보호자 등 성인을 위한 것이며, 만 14세 미만 아동의 개인정보를 받지 않습니다. 만 14세 미만 아동의 정보가 들어온 것을 알게 되면 회신하지 않고 바로 지웁니다. 사이트에서 연결하는 학생용 웹앱은 별도 사이트로 열리며, 학생 계정을 만들지 않습니다. 앱마다 카메라 사용 여부와 저장·전송하는 정보를 콘텐츠 카드와 각 앱 안내에 밝힙니다.</p>

        <h2>8. 개인정보 보호책임자</h2>
        <p>이승열 (레브랩 대표) · {CONTACT_EMAIL}</p>
        <p>개인정보 침해에 대한 상담은 개인정보침해신고센터(국번 없이 118, privacy.kisa.or.kr)나 개인정보분쟁조정위원회(1833-6972, www.kopico.go.kr)에도 하실 수 있습니다.</p>

        <h2>9. 바뀔 때</h2>
        <p>이 방침이 바뀌면 시행일과 함께 이 페이지에 알립니다.</p>
      </div>
    </PageShell>
  );
}
