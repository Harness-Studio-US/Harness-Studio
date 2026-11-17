import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Docs from "./pages/Docs";
import Brand from "./pages/Brand";
import Console from "./pages/Console";
import GetStarted from "./pages/GetStarted";
import ResetPassword from "./pages/ResetPassword";
import { PrivacyPolicy, TermsOfService } from "./pages/Legal";
import { CookieNotice } from "./components/CookieNotice";
import { AuthAction } from "./components/auth/AuthAction";
import { removeLegacyCredentials } from "./lib/copilotState";

/** Firebase email links land on the site root with `mode` and `oobCode` in the query. */
function readAuthAction(): { mode: string; oobCode: string } | null {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  const oobCode = params.get("oobCode");
  if (!mode || !oobCode) return null;
  return { mode, oobCode };
}

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
  const [authAction, setAuthAction] = useState(readAuthAction);

  useEffect(() => {
    removeLegacyCredentials();
  }, []);

  if (authAction) {
    return (
      <>
        <AuthAction
          mode={authAction.mode}
          oobCode={authAction.oobCode}
          onDone={() => setAuthAction(null)}
        />
        <CookieNotice />
      </>
    );
  }

  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="/console" element={<Console />} />
        <Route path="/login" element={<Navigate to="/console" replace />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CookieNotice />
    </>
  );
}
