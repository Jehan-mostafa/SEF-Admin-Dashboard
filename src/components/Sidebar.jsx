
const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: "⌂" },
  { name: "Users", path: "/users", icon: "♙" },
  { name: "Products", path: "/products", icon: "◇" },
  { name: "Add Product", path: "/products/add", icon: "+" },
  { name: "Orders", path: "/orders", icon: "▤" },
  { name: "Carts", path: "/carts", icon: "🛒" },
  { name: "Settings", path: "/settings", icon: "⚙" },
];

export default function Sidebar({
  activePath = "/dashboard",
  onNavigate,
  mobileOpen = false,
  onClose,
}) {
  return (
    <>
      {mobileOpen && (
        <button
          className="sidebar-overlay"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <h2>KODA STORE</h2>
          <p>ONLINE STORE</p>
        </div>

        <nav className="sidebar-menu" aria-label="Main navigation">
          {menuItems.map((item) => {
            const isActive = activePath === item.path;

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => {
                  onNavigate?.(item.path);
                  onClose?.();
                }}
                aria-current={isActive ? "page" : undefined}
                className={`sidebar-link ${
                  isActive ? "sidebar-link-active" : ""
                }`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-status">
          <p className="live-label">LIVE</p>
          <p>Connected to the E-commerce API</p>
        </div>
      </aside>
    </>
  );
}
