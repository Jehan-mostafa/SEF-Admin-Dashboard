
export default function Navbar({
  onMenuClick,
  darkMode = false,
  onToggleTheme,
  onLogout,
}) {
  return (
    <header className="navbar">
      <div className="navbar-heading">
        <button
          className="mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          ☰
        </button>

        <div>
          <h1>Koda Dashboard</h1>
          <p>E-Commerce Admin Panel</p>
        </div>
      </div>

      <div className="navbar-actions">
        <button className="icon-button" aria-label="Notifications">
          ♧
          <span className="notification-dot" />
        </button>

        <button
          className="icon-button"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          {darkMode ? "☀" : "☾"}
        </button>

        <div className="admin-profile">
          <div className="admin-avatar">A</div>
          <div className="admin-info">
            <strong>ADMIN</strong>
            <span>Admin</span>
          </div>
        </div>

        <button className="logout-button" onClick={onLogout}>
          ↪ Logout
        </button>
      </div>
    </header>
  );
}
