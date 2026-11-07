import Link from "next/link";
import PageShell, { ComingSoon } from "../components/PageShell";

export default function ReligionSelPage() {
  return (
    <PageShell
      title="종교와 사회정서"
      sub="종교시간에도 마음을 배우고 관계를 연습합니다. 교목 선생님을 위해 종교 수업과 사회정서교육을 잇는 콘텐츠를 준비합니다."
    >
      <section className="content-section" aria-labelledby="religion-sel-purpose">
        <h2 className="content-h2" id="religion-sel-purpose">종교시간에 함께 배우는 마음과 관계</h2>
        <p className="content-lead">
          종교 수업의 이야기와 질문을 학생의 일상에 연결합니다.
          자신의 감정을 이해하고, 다른 사람의 마음에 귀 기울이고,
          공동체 안에서 배려를 실천하는 사회정서교육 콘텐츠를 담을 공간입니다.
        </p>
      </section>

      <section className="content-section" aria-label="수업 자료 준비 안내">
        <ComingSoon
          title="수업 콘텐츠를 준비하고 있어요"
          note="종교시간에 활용할 수업 자료를 정리하고 있습니다. 자료가 준비되면 이곳에서 안내하겠습니다."
          actions={[{ to: "/contact", label: "종교 수업 콘텐츠 문의" }]}
        />
      </section>

      <section className="content-section" aria-labelledby="religion-sel-public">
        <h2 className="content-h2" id="religion-sel-public">모든 학교를 위한 사회정서교육도 만나보세요</h2>
        <p className="content-lead">
          일반학교를 포함한 모든 학교의 선생님께 열려 있는 사회정서교육 수업은
          특정 종교를 전제하지 않습니다. 서울 사회정서교육 체계에 맞춘 수업과
          게임·활동 도구를 바로 활용하실 수 있습니다.
        </p>
        <div className="cta-row-plain">
          <Link className="btn btn-ghost" href="/curriculum">사회정서교육 수업 보기</Link>
          <Link className="btn btn-ghost" href="/tools">SEL 콘텐츠 보기</Link>
        </div>
      </section>
    </PageShell>
  );
}
