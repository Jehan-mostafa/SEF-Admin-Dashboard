import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
} from "lucide-react";
import Button from "../ui/Button";

export default function Navbar({
  onMenuClick,
  darkMode = false,
  onToggleTheme,
  onLogout,
}) {
  return (
    <header className="sticky top-0 z-30 flex min-h-22.5 items-center justify-between gap-4 border-b border-line bg-surface px-4 py-4 transition-colors sm:px-7">
      <div className="flex items-center gap-2.5">
        <Button
          variant="outline"
          className="rounded-[10px] px-3 py-2 md:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
        <div>
          <h1 className="text-lg font-bold sm:text-2xl">Koda Dashboard</h1>
          <p className="mt-1 text-xs text-muted sm:text-sm">
            E-Commerce Admin Panel
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        <Button
          variant="icon"
          className="relative size-9 rounded-[14px] sm:size-11"
          aria-label="Notifications"
        >
          <Bell className="size-5" aria-hidden="true" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-danger" />
        </Button>
        <Button
          variant="icon"
          className="size-9 rounded-[14px] sm:size-11"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <Sun className="size-5" aria-hidden="true" />
          ) : (
            <Moon className="size-5" aria-hidden="true" />
          )}
        </Button>
        <div className="hidden items-center gap-3 rounded-2xl border border-line bg-page/50 px-3 py-2 transition-colors hover:border-accent/60 hover:bg-page lg:flex">
          <div className="relative grid size-10 place-items-center rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white shadow-md shadow-cyan-900/20">
            AM
            <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-surface bg-emerald-500" />
          </div>
          <div className="grid gap-0.5 leading-tight">
            <strong className="text-sm">Jehan Mostafa</strong>
            <span className="flex items-center gap-1 text-xs text-muted">
              <ShieldCheck
                className="size-3.5 text-accent"
                aria-hidden="true"
              />
              Administrator
            </span>
          </div>
          <ChevronDown className="size-4 text-muted" aria-hidden="true" />
        </div>
        <Button
          variant="danger"
          className="rounded-xl px-3 py-2.5 text-sm font-bold shadow-sm shadow-rose-950/20 sm:px-4"
          onClick={onLogout}
        >
          <LogOut className="mr-1 size-4" aria-hidden="true" />
          Logout
        </Button>
      </div>
    </header>
  );
}
