import { useEffect, useState } from "react";
import {
  Clock3,
  DollarSign,
  Package,
  ShoppingBag,
  ShoppingCart,
  Users,
} from "lucide-react";
import { getDashboardStats } from "../../../api/dashboard";

const numberFormat = new Intl.NumberFormat("en-US");
const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const emptyDashboard = {
  orders: { total: 0, pending: 0 },
  revenue: { total: 0, thisMonth: 0 },
  topProducts: [],
  totalCustomers: 0,
};

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getDashboardStats()
      .then((result) => {
        if (active) setDashboard(result);
      })
      .catch(() => {
        if (active) {
          setError("تعذر تحميل بيانات لوحة التحكم. تحقق من صلاحية تسجيل الدخول.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const topProduct = dashboard.topProducts?.[0];
  const cards = [
    {
      label: "Total Orders",
      value: numberFormat.format(dashboard.orders?.total ?? 0),
      detail: "All orders received",
      icon: ShoppingBag,
      gradient: "from-emerald-400 to-emerald-600",
      iconClass: "bg-emerald-50 text-emerald-500",
    },
    {
      label: "Pending Orders",
      value: numberFormat.format(dashboard.orders?.pending ?? 0),
      detail: "Awaiting action",
      icon: Clock3,
      gradient: "from-amber-400 to-orange-500",
      iconClass: "bg-orange-50 text-orange-500",
    },
    {
      label: "Revenue",
      value: currencyFormat.format(dashboard.revenue?.total ?? 0),
      detail: "Total gross revenue",
      icon: DollarSign,
      gradient: "from-pink-400 to-rose-500",
      iconClass: "bg-pink-50 text-pink-500",
    },
    {
      label: "This Month",
      value: currencyFormat.format(dashboard.revenue?.thisMonth ?? 0),
      detail: "Monthly sales target",
      icon: ShoppingCart,
      gradient: "from-cyan-400 to-sky-500",
      iconClass: "bg-sky-50 text-sky-500",
    },
    {
      label: "Top Product",
      value: topProduct?.name || "No sales yet",
      detail: `${numberFormat.format(topProduct?.totalSold ?? 0)} sold`,
      icon: Package,
      gradient: "from-violet-400 to-fuchsia-500",
      iconClass: "bg-violet-50 text-violet-500",
      largeValue: true,
    },
    {
      label: "Users",
      value: numberFormat.format(dashboard.totalCustomers ?? 0),
      detail: "Registered customers",
      icon: Users,
      gradient: "from-slate-400 to-slate-600",
      iconClass: "bg-slate-100 text-slate-500",
    },
  ];

  return (
    <section aria-labelledby="dashboard-title">
      <header className="mb-8 rounded-3xl border border-line bg-surface px-8 py-7">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-cyan-500">
          Admin Overview
        </p>
        <h2 id="dashboard-title" className="mt-4 text-3xl font-bold text-ink">
          Real-time commerce health
        </h2>
        <p className="mt-2 text-muted">
          Monitor your storefront with live API metrics.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {cards.map(
          ({ label, value, detail, icon: Icon, gradient, iconClass, largeValue }) => (
            <article
              key={label}
              className="relative overflow-hidden rounded-3xl border border-line bg-surface px-8 py-7 shadow-[0_16px_35px_rgba(15,23,42,0.09)]"
            >
              <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${gradient}`} />
              <div className="flex min-h-48 items-start justify-between gap-5">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-muted">{label}</h3>
                  {loading ? (
                    <div className="mt-5 h-10 w-32 animate-pulse rounded-lg bg-line" />
                  ) : (
                    <strong
                      className={`mt-5 block break-words font-black leading-tight text-ink ${
                        largeValue ? "text-[2rem]" : "text-3xl"
                      }`}
                    >
                      {value}
                    </strong>
                  )}
                  <p className="mt-3 text-sm text-muted">{detail}</p>
                </div>
                <div
                  className={`grid size-15 shrink-0 place-items-center rounded-2xl ${iconClass}`}
                >
                  <Icon className="size-7" aria-hidden="true" />
                </div>
              </div>
            </article>
          ),
        )}
      </div>
    </section>
  );
}
