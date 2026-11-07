import StudentRoom from "../../components/live/StudentRoom";

export const metadata = {
  title: "수업방 참여 | 레브랩",
  description: "이름 없이, 우리 반의 생각을 함께 나누어요.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.levlab.co.kr/live" },
};
export default function LivePage() { return <StudentRoom />; }
