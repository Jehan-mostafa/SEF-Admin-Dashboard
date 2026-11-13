function ProductsStats({ stats }) {
  return (
    <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-3xl border border-line bg-surface p-6"
          >
            <div className="mb-5 inline-flex rounded-xl border border-line bg-page p-3 text-brand">
              <Icon size={22} />
            </div>

            <h2 className="text-3xl font-bold text-ink">
              {stat.value}
            </h2>

            <p className="mt-1 text-sm text-muted">
              {stat.title}
            </p>
          </div>
        );
      })}
    </section>
  );
}

export default ProductsStats;
