import {
  CirclePlus,
  ClipboardList,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import Button from "../ui/Button";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Users", path: "/users", icon: Users },
  { name: "Products", path: "/products", icon: Package },
  { name: "Add Product", path: "/products/add", icon: CirclePlus },
  { name: "Orders", path: "/orders", icon: ClipboardList },
  { name: "Carts", path: "/carts", icon: ShoppingCart },
  { name: "Settings", path: "/settings", icon: Settings },
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
          className="fixed inset-0 z-40 cursor-pointer bg-black/50 md:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-70 -translate-x-full flex-col overflow-y-auto border-r border-sidebar-line bg-sidebar bg-[radial-gradient(circle_at_top_right,_rgb(6_182_212_/_18%),_transparent_34%)] px-4 py-5 text-sidebar-text shadow-2xl transition-colors duration-300 md:w-[280px] md:translate-x-0 ${mobileOpen ? "translate-x-0" : ""}`}
      >
        <div className="flex items-start justify-between border-b border-sidebar-line px-3 pb-6 pt-2">
          <div className="rounded-xl bg-white p-2 shadow-lg shadow-black/15">
            <img
              src="/logo.png"
              alt="Koda Store"
              className="h-14 w-44.5 object-contain"
            />
          </div>
          <Button
            variant="sidebar"
            className="size-9 rounded-lg md:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X className="size-5" aria-hidden="true" />
          </Button>
        </div>

        <nav className="mt-7 grid gap-1.5" aria-label="Main navigation">
          <p className="px-3 pb-2 text-[10px] font-semibold tracking-[0.2em] text-sidebar-muted">
            MAIN MENU
          </p>
          {menuItems.map((item) => {
            const isActive = activePath === item.path;
            const Icon = item.icon;

            return (
              <Button
                key={item.path}
                variant={isActive ? "sidebarActive" : "sidebar"}
                onClick={() => {
                  onNavigate?.(item.path);
                  onClose?.();
                }}
                aria-current={isActive ? "page" : undefined}
                className={`relative w-full justify-start gap-3.5 rounded-xl px-4 py-3 text-left ${isActive ? "before:absolute before:left-0 before:h-6 before:w-1 before:rounded-r-full before:bg-sidebar-accent" : ""}`}
              >
                <Icon className="size-5 shrink-0" aria-hidden="true" />
                <span>{item.name}</span>
              </Button>
            );
          })}
        </nav>

        <div className="mt-auto px-3 pt-8 text-xs text-sidebar-muted">
          <div className="flex items-center gap-2 border-t border-sidebar-line pt-5">
            <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgb(52_211_153)]" />
            <span>System operational</span>
          </div>
        </div>
      </aside>
    </>
  );
}
