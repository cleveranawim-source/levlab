import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** 라우트 변경 시 스크롤을 맨 위로 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
