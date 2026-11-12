export default function Input({
  className = "",
  ...props
}) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 ${className}`}
    />
  );
}
