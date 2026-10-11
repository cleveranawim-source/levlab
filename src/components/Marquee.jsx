import Logo from "./Logo";

const ROW_A = ["감정 인식", "공감", "회복탄력성", "건강한 소통", "자기관리"];
const ROW_B = ["책임 있는 결정", "협력", "갈등 해결", "마음 근육", "관계 돌봄"];

function Row({ words, rev = false }) {
  // 같은 묶음을 두 번 이어 붙여 translateX(-50%) 로 끊김 없이 순환
  const half = [...words, ...words];
  return (
    <div className={`mq-row ${rev ? "rev" : ""}`}>
      {[0, 1].map((k) => (
        <div key={k} style={{ display: "flex" }}>
          {half.map((w, i) => (
            <span className="mq-item" key={`${k}-${i}`}>
              {w}
              <Logo />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/** SEL 키워드가 양방향으로 흐르는 키네틱 띠 */
export default function Marquee() {
  return (
    <section className="marquee" aria-label="SEL 핵심 역량: 감정 인식, 공감, 회복탄력성, 건강한 소통, 자기관리, 책임 있는 결정, 협력, 갈등 해결">
      <div aria-hidden="true">
        <Row words={ROW_A} />
        <Row words={ROW_B} rev />
      </div>
    </section>
  );
}
