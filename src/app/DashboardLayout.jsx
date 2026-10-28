import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className={`min-h-screen bg-page text-ink transition-colors ${darkMode ? "dark-theme" : ""}`}
    >
      <Sidebar
        activePath={location.pathname}
        onNavigate={(path) => navigate(path)}
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}
