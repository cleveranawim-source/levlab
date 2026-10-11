import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Loader from "./components/Loader";
import Spotlight from "./components/Spotlight";
import HomePage from "./pages/HomePage";
import ToolsPage from "./pages/ToolsPage";
import AboutPage from "./pages/AboutPage";
import ProgramsPage from "./pages/ProgramsPage";
import ResourcesPage from "./pages/ResourcesPage";
import InsightsPage from "./pages/InsightsPage";
import ContactPage from "./pages/ContactPage";

/** 경로가 바뀔 때마다 페이지가 부드럽게 페이드인 */
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-in">
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Loader />
      <ScrollToTop />
      <Spotlight />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
