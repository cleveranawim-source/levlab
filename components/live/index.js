// 실시간 참여 연결 지점. 같은 lesson.slug로 방 상태를 공유하며 별도 Provider는 필요 없다.
// LiveControl: 발표기 도구 막대에 놓는 '수업방 열기' 버튼·QR 패널.  props: { lesson, slide, index }
// LiveSlot:    live 필드가 있는 슬라이드 안에 놓는 실시간 결과(투표 막대·한 문장 벽). props: { lesson, slide, index }
export { default as LiveControl } from "./LiveControl";
export { default as LiveSlot } from "./LiveSlot";
