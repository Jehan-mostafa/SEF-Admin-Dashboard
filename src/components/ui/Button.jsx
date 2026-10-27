const variants = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  danger: "bg-danger text-white hover:bg-danger-hover",
  outline:
    "border border-line bg-surface text-ink hover:border-accent hover:bg-page",
  icon: "border border-line bg-surface text-ink hover:border-accent hover:bg-page hover:text-accent",
  sidebar: "text-slate-200 hover:bg-sidebar-hover hover:text-white",
  sidebarActive:
    "bg-sidebar-active text-cyan-300 shadow-lg shadow-black/15 hover:bg-sidebar-hover hover:text-cyan-200",
};

export default function Button({
  children,
  className = "",
  type = "button",
  variant = "primary",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex cursor-pointer items-center justify-center transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
