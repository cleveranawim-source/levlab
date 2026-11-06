import { Link } from "react-router-dom";
import Logo from "./Logo";
import { CONTACT_EMAIL, YOUTUBE_URL } from "../data/site";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div>
          <Link to="/" className="logo" style={{ display: "inline-flex" }} aria-label="Lev Lab 홈">
            <Logo white />
            <span className="wm" style={{ color: "#fff" }}>LEV&nbsp;LAB</span>
          </Link>
          <p className="desc" style={{ marginTop: 14 }}>서울 사회정서교육에 맞춘 중학교 SEL 수업과 웹앱을 만드는 교육 콘텐츠 연구소.</p>
        </div>
        <div>
          <h2 className="foot-h">둘러보기</h2>
          <Link to="/about">소개</Link>
          <Link to="/programs">SEL 수업</Link>
          <Link to="/tools">SEL 콘텐츠</Link>
        </div>
        <div>
          <h2 className="foot-h">연결</h2>
          <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">LevLab 유튜브</a>
          <Link to="/#newsletter">공개 소식 받기</Link>
          <Link to="/contact">문의·협업</Link>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
        <div className="copy">© 2026 Lev Lab. 마음을 읽는 교육. · <Link to="/privacy">개인정보 처리방침</Link></div>
      </div>
    </footer>
  );
}
