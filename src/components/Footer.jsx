import { Link } from "react-router-dom";
import Logo from "./Logo";
import { CATCHPHRASE, CONTACT_EMAIL, YOUTUBE_URL } from "../data/site";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div>
          <Link to="/" className="logo" style={{ display: "inline-flex" }}>
            <Logo white />
            <span className="wm" style={{ color: "#fff" }}>LEV&nbsp;LAB</span>
          </Link>
          <p className="slogan" style={{ color: "#BFE9CD", marginTop: 14, display: "flex" }}>{CATCHPHRASE}</p>
          <p className="desc">사회정서학습(SEL)으로 학생의 마음 근육을 키우는 교육 콘텐츠 연구소.</p>
        </div>
        <div>
          <h5>둘러보기</h5>
          <Link to="/about">소개</Link>
          <Link to="/tools">SEL 콘텐츠</Link>
          <Link to="/programs">프로그램</Link>
          <Link to="/resources">자료실</Link>
          <Link to="/insights">인사이트</Link>
        </div>
        <div>
          <h5>연결</h5>
          <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">LevLab 유튜브</a>
          <Link to="/contact">뉴스레터</Link>
          <Link to="/contact">협업 문의</Link>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
        <div className="copy">© 2026 Lev Lab. 마음을 읽는 교육. All rights reserved.</div>
      </div>
    </footer>
  );
}
