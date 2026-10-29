import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../app/DashboardLayout";

const pageRoutes = [
  { path: "/dashboard", title: "Dashboard" },
  { path: "/users", title: "Users" },
  { path: "/products", title: "Products" },
  { path: "/products/add", title: "Add Product" },
  { path: "/orders", title: "Orders" },
  { path: "/carts", title: "Carts" },
  { path: "/settings", title: "Settings" },
];

function PagePlaceholder({ title }) {
  return (
    <section className="grid min-h-[calc(100vh-178px)] place-items-center rounded-2xl border border-line bg-surface text-center">
      <div>
        <h2 className="text-2xl font-bold text-ink">{title}</h2>
      </div>
    </section>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        {pageRoutes.map(({ path, title }) => (
          <Route
            key={path}
            path={path}
            element={<PagePlaceholder title={title} />}
          />
        ))}
        <Route
          path="*"
          element={<PagePlaceholder title="Page not found" />}
        />
      </Route>
    </Routes>
  );
}
