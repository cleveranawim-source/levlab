import { useTheme } from "../lib/hooks";

export default function ThemeToggle() {
  const { toggle } = useTheme();
  return (
    <button className="tog" onClick={toggle} aria-label="밝게/어둡게 전환" title="테마 전환">
      ◐
    </button>
  );
}
