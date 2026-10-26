
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [activePath, setActivePath] = useState(
    window.location.pathname || "/dashboard"
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleNavigate = (path) => {
    setActivePath(path);
    window.history.pushState({}, "", path);
  };

  return (
    <div className={`app-layout ${darkMode ? "dark-theme" : ""}`}>
      <Sidebar
        activePath={activePath}
        onNavigate={handleNavigate}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="main-layout">
        <Navbar
          onMenuClick={() => setMobileOpen(true)}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode((previous) => !previous)}
          onLogout={() => {
            // اربطي هنا منطق تسجيل الخروج الموجود في المشروع.
          }}
        />

        <main className="page-content">
          {/* محتوى الصفحة سيُضاف بواسطة نظام صفحات المشروع */}
        </main>
      </div>
    </div>
  );
}

export default App;
