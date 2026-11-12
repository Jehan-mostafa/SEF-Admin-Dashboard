export default function Label({ htmlFor, children, required = false }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
    >
      {children}
      {required && <span className="ml-1 text-rose-500">*</span>}
    </label>
  );
}
