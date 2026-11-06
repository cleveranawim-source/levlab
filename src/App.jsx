import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import SkipLink from "./components/SkipLink";
import Spotlight from "./components/Spotlight";
import HomePage from "./pages/HomePage";
import ToolsPage from "./pages/ToolsPage";
import AboutPage from "./pages/AboutPage";
import ProgramsPage from "./pages/ProgramsPage";
import ResourcesPage from "./pages/ResourcesPage";
import InsightsPage from "./pages/InsightsPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";
import { usePageMeta } from "./lib/pageMeta";

/** 경로가 바뀔 때마다 페이지가 부드럽게 페이드인 */
function AnimatedRoutes() {
  const location = useLocation();
  usePageMeta(location.pathname);
  return (
    // Phase 0: page-owned Nav/Footer remain inside main until the shared shell moves here.
    <main id="main" tabIndex={-1} key={location.pathname} className="page-in" aria-label="본문">
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        {/* Vercel's SPA rewrite returns HTTP 200; this client 404 uses noindex. */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SkipLink />
      <ScrollToTop />
      <Spotlight />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
