import { useEffect, useMemo, useState } from "react";
import {
  Package,
  Star,
  TrendingUp,
  Boxes,
  Search,
  SlidersHorizontal,
  Plus,
  Eye,
  Pencil,
  Trash2,
  LoaderCircle,
  AlertCircle,
  X,
} from "lucide-react";

const API_URL = "https://e-commerce-api-3wara.vercel.app";
const PRODUCTS_PER_PAGE = 10;

const categories = [
  { value: "", label: "All Categories" },
  { value: "electronics", label: "Electronics" },
  { value: "beauty", label: "Beauty" },
  { value: "sports", label: "Sports" },
  { value: "home", label: "Home" },
  { value: "fashion", label: "Fashion" },
  { value: "phones", label: "Phones" },
];

const sortOptions = [
  { value: "", label: "Default" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
];

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: "1",
          limit: "100",
        });

        if (searchQuery) {
          params.set("search", searchQuery);
        }

        const response = await fetch(
          `${API_URL}/products?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        if (!data.success || !Array.isArray(data.products)) {
          throw new Error("Invalid products response");
        }

        let allProducts = [...data.products];
        const totalPages = data.totalPages || 1;

        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
          const pageParams = new URLSearchParams(params);
          pageParams.set("page", String(currentPage));

          const nextResponse = await fetch(
            `${API_URL}/products?${pageParams.toString()}`,
            { signal: controller.signal }
          );

          if (!nextResponse.ok) {
            throw new Error("Failed to fetch products");
          }

          const nextData = await nextResponse.json();

          if (!nextData.success || !Array.isArray(nextData.products)) {
            throw new Error("Invalid products response");
          }

          allProducts = [...allProducts, ...nextData.products];
        }

        if (!controller.signal.aborted) {
          setProducts(allProducts);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          setProducts([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, [searchQuery]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.toLowerCase();

    let result = products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        (product.name || "").toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        !category || product.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result.sort((a, b) => b.averageRating - a.averageRating);
    }

    return result;
  }, [products, searchQuery, category, sort]);

  const totalProducts = filteredProducts.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalProducts / PRODUCTS_PER_PAGE)
  );

  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
  if (page > 1) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}, [page]);

  const visibleProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

    return filteredProducts.slice(
      startIndex,
      startIndex + PRODUCTS_PER_PAGE
    );
  }, [filteredProducts, currentPage]);

  const stats = [
    {
      title: "Total",
      value: totalProducts,
      icon: Package,
    },
    {
      title: "Featured",
      value: visibleProducts.filter((product) => product.featured).length,
      icon: Star,
    },
    {
      title: "In Stock",
      value: visibleProducts.filter((product) => product.stock > 0).length,
      icon: TrendingUp,
    },
    {
      title: "Out of Stock",
      value: visibleProducts.filter((product) => product.stock <= 0).length,
      icon: Boxes,
    },
  ];

  function handleSearch(event) {
    event.preventDefault();
    setPage(1);
    setSearchQuery(search.trim());
  }

  function handleCategoryChange(event) {
    setCategory(event.target.value);
    setPage(1);
  }

  function handleSortChange(event) {
    setSort(event.target.value);
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setSearchQuery("");
    setCategory("");
    setSort("");
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-[#090e1d] px-4 py-6 text-white sm:px-6 lg:px-10 lg:py-10">
      <section className="mb-8 flex flex-col gap-5 rounded-3xl border border-slate-700 bg-gradient-to-r from-[#1b2037] to-[#102434] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-cyan-700 bg-cyan-900/30 p-4 text-cyan-400">
            <Package size={30} />
          </div>

          <div>
            <p className="mb-1 text-xs tracking-[0.35em] text-cyan-400 sm:text-sm">
              PRODUCT DASHBOARD
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              Products
            </h1>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl border border-cyan-600 bg-cyan-900/20 px-6 py-3 font-semibold text-cyan-400 transition hover:bg-cyan-900/40"
        >
          <Plus size={20} />
          Add Product
        </button>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-3xl border border-slate-700 bg-[#171e30] p-6"
            >
              <div className="mb-5 inline-flex rounded-xl border border-slate-600 bg-slate-700/40 p-3 text-slate-300">
                <Icon size={22} />
              </div>

              <h2 className="text-3xl font-bold">{stat.value}</h2>

              <p className="mt-1 text-sm text-slate-400">
                {stat.title}
              </p>
            </div>
          );
        })}
      </section>

      <section className="mb-8 rounded-3xl border border-slate-700 bg-[#171e30] p-4 sm:p-6">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 lg:flex-row"
        >
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-600 bg-[#242e41] px-4">
            <Search
              size={20}
              className="shrink-0 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-400"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-[#242e41] px-6 py-4 text-slate-300 transition hover:bg-slate-700"
          >
            <SlidersHorizontal size={20} />
            Filters
          </button>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-white transition hover:bg-cyan-600"
          >
            <Search size={20} />
            Search
          </button>
        </form>

        {showFilters && (
          <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-700 pt-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="product-category"
                className="mb-2 block text-sm text-slate-300"
              >
                Category
              </label>

              <select
                id="product-category"
                value={category}
                onChange={handleCategoryChange}
                className="w-full rounded-xl border border-slate-600 bg-[#242e41] p-3 text-white"
              >
                {categories.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="product-sort"
                className="mb-2 block text-sm text-slate-300"
              >
                Sort By
              </label>

              <select
                id="product-sort"
                value={sort}
                onChange={handleSortChange}
                className="w-full rounded-xl border border-slate-600 bg-[#242e41] p-3 text-white"
              >
                {sortOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-4 py-3 text-slate-300 hover:bg-slate-700 sm:col-span-2"
            >
              <X size={18} />
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {loading && (
        <div className="flex items-center justify-center gap-3 py-20 text-cyan-400">
          <LoaderCircle className="animate-spin" />
          Loading products...
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-700 bg-red-900/20 p-5 text-red-400">
          <AlertCircle />
          {error}
        </div>
      )}

      {!loading && !error && visibleProducts.length === 0 && (
        <div className="rounded-2xl border border-slate-700 bg-[#171e30] py-20 text-center text-slate-400">
          No products found.
        </div>
      )}

      {!loading && !error && visibleProducts.length > 0 && (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {visibleProducts.map((product) => {
            const image = product.images?.[0]?.url;

            return (
              <article
                key={product._id}
                className="min-w-0 overflow-hidden rounded-3xl border border-slate-700 bg-[#171e30]"
              >
                <div className="relative h-56 bg-slate-800 sm:h-72 lg:h-80">
                  {image ? (
                    <img
                      src={image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-500">
                      <Package size={60} />
                    </div>
                  )}

                  {product.featured && (
                    <span className="absolute left-4 top-4 rounded-full bg-yellow-400 px-4 py-1 text-sm font-semibold text-black">
                      ★ Featured
                    </span>
                  )}

                  <span
                    className={`absolute bottom-4 right-4 rounded-full px-4 py-2 text-sm font-semibold ${
                      product.stock > 0
                        ? "border border-emerald-500 bg-emerald-500/30 text-emerald-300"
                        : "border border-red-400 bg-red-500/30 text-red-200"
                    }`}
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of Stock"}
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  <h2 className="mb-2 text-xl font-bold sm:text-2xl">
                    {product.name}
                  </h2>

                  <p className="mb-5 text-xs uppercase tracking-wider text-slate-400 sm:text-sm">
                    {[
                      product.category,
                      product.subcategory,
                      product.brand,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>

                  <p className="mb-6 min-h-12 text-sm leading-7 text-slate-400 sm:text-base">
                    {product.shortDescription ||
                      product.description ||
                      "No description available."}
                  </p>

                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    <span className="text-3xl font-bold sm:text-4xl">
                      ${product.price}
                    </span>

                    {product.discountPrice != null &&
                      product.discountPrice < product.price && (
                        <span className="font-semibold text-emerald-400">
                          -$
                          {(
                            product.price - product.discountPrice
                          ).toFixed(2)}{" "}
                          off
                        </span>
                      )}
                  </div>

                  <div className="mb-5 flex flex-wrap gap-2">
                    {product.tags?.map((tag, index) => (
                      <span
                        key={`${tag}-${index}`}
                        className="rounded-lg border border-slate-600 bg-[#242e41] px-3 py-1 text-xs text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 border-t border-slate-700 pt-5">
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-xl border border-slate-600 bg-[#242e41] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-700"
                    >
                      <Eye size={17} />
                      View
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-xl border border-slate-600 bg-[#242e41] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-700"
                    >
                      <Pencil size={17} />
                      Edit
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-xl border border-slate-600 bg-[#242e41] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-700"
                    >
                      <SlidersHorizontal size={17} />
                      Quick Edit
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-xl border border-red-800 bg-red-900/10 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-900/30 sm:ml-auto"
                    >
                      <Trash2 size={17} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {!loading && !error && totalPages > 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
            className="rounded-xl border border-slate-600 bg-[#171e30] px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm text-slate-400">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
            className="rounded-xl border border-slate-600 bg-[#171e30] px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}

export default ProductsList;