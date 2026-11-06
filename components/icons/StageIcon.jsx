const STAGES = {
  도입: <><path d="M5 20V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v16M3 21h16M8 12h13m-3-3 3 3-3 3" /><path d="M9 7h3" /></>,
  이해하기: <><path d="M12 5C9 3 6 3 3 4v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Zm0 0v15M6 8h3m-3 4h3m6-4h3m-3 4h3" /></>,
  연습하기: <><path d="m14 5 5 5M4 20l5-1L20 8a2.8 2.8 0 0 0-4-4L5 15l-1 5ZM13 20h7" /></>,
  적용하기: <><path d="M5 12H3V5a2 2 0 0 1 2-2h7v3a2 2 0 1 0 4 0V3h3a2 2 0 0 1 2 2v7h-3a2 2 0 1 0 0 4h3v3a2 2 0 0 1-2 2h-7v-3a2 2 0 1 0-4 0v3H5a2 2 0 0 1-2-2v-3h2a2 2 0 1 0 0-4Z" /></>,
  정리: <><path d="M8 4H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" /><rect x="8" y="2" width="8" height="4" rx="1" /><path d="m8 13 3 3 5-6" /></>,
};
const NOTES = {
  자료: <><path d="M7 3h8l4 4v14H7zM15 3v5h4M4 6v12M10 12h6m-6 4h6" /></>,
  팁: <><path d="M9 18v-2c-4-3-4-7-1-10a6 6 0 0 1 8 0c3 3 3 7-1 10v2M9 18h6M10 21h4" /><path d="M12 9v5" /></>,
  유의: <><path d="m10.3 4-8 14a2 2 0 0 0 1.7 3h16a2 2 0 0 0 1.7-3l-8-14a2 2 0 0 0-3.4 0Z" /><path d="M12 9v5m0 3v.1" /></>,
};
function Icon({ children, size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{children}</svg>;
}
export function StageIcon({ stage, size = 24 }) { return <Icon size={size}>{STAGES[stage] || STAGES.정리}</Icon>; }
export function NoteIcon({ kind, size = 20 }) { return <Icon size={size}>{NOTES[kind] || NOTES.자료}</Icon>; }
export default StageIcon;
