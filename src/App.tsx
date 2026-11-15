import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Docs from "./pages/Docs";
import Brand from "./pages/Brand";
import Console from "./pages/Console";
import GetStarted from "./pages/GetStarted";
import { PrivacyPolicy, TermsOfService } from "./pages/Legal";
import { removeLegacyCredentials } from "./lib/copilotState";

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const timer = window.setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 60);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  useEffect(() => {
    removeLegacyCredentials();
  }, []);

  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="/console" element={<Console />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
