import { useState } from "react";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";

function App() {
  const [activePath, setActivePath] = useState(
    window.location.pathname || "/dashboard",
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleNavigate = (path) => {
    setActivePath(path);
    window.history.pushState({}, "", path);
  };

  return (
    <div
      className={`min-h-screen bg-page text-ink transition-colors ${darkMode ? "dark-theme" : ""}`}
    >
      <Sidebar
        activePath={activePath}
        onNavigate={handleNavigate}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="min-h-screen md:ml-70">
        <Navbar
          onMenuClick={() => setMobileOpen(true)}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode((previous) => !previous)}
          onLogout={() => {}}
        />

        <main className="min-h-[calc(100vh-90px)] p-4 sm:p-7">
          {activePath === "/dashboard" && <DashboardPage />}
        </main>
      </div>
    </div>
  );
}

export default App;
