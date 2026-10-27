import { useEffect, useMemo, useRef, useState } from "react";
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
  ChevronDown,
  Check,
} from "lucide-react";
import Button from "../../../components/ui/Button";

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

function Dropdown({ id, label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption =
    options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleSelect(optionValue) {
    onChange(optionValue);
    setIsOpen(false);
  }

  return (
    <div ref={dropdownRef} className="relative min-w-0">
      <label
        id={`${id}-label`}
        className="mb-2 block text-sm font-medium text-ink"
      >
        {label}
      </label>

      <button
        id={id}
        type="button"
        aria-labelledby={`${id}-label`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-left text-sm text-ink transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="truncate">{selectedOption.label}</span>

        <ChevronDown
          size={18}
          className={`shrink-0 text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-labelledby={`${id}-label`}
          className="absolute left-0 right-0 top-full z-30 mt-2 max-h-60 overflow-y-auto rounded-xl border border-line bg-surface p-1 shadow-xl"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={value === option.value}
              onClick={() => handleSelect(option.value)}
              className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                value === option.value
                  ? "bg-brand/10 font-semibold text-brand"
                  : "text-ink hover:bg-page"
              }`}
            >
              <span>{option.label}</span>

              {value === option.value && (
                <Check size={16} className="shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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

  const productsSectionRef = useRef(null);

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

        for (
          let currentPage = 2;
          currentPage <= totalPages;
          currentPage++
        ) {
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

          if (
            !nextData.success ||
            !Array.isArray(nextData.products)
          ) {
            throw new Error("Invalid products response");
          }

          allProducts = [...allProducts, ...nextData.products];
        }

        if (!controller.signal.aborted) {
          setProducts(allProducts);
        }
      } catch (err) {
        if (err.name !== "AbortError" && !controller.signal.aborted) {
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
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        (product.name || "")
          .toLowerCase()
          .includes(normalizedSearch);

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
      result.sort(
        (a, b) =>
          (b.averageRating || 0) - (a.averageRating || 0)
      );
    }

    return result;
  }, [products, searchQuery, category, sort]);

  const totalProducts = filteredProducts.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalProducts / PRODUCTS_PER_PAGE)
  );

  const currentPage = Math.min(page, totalPages);

  const visibleProducts = useMemo(() => {
    const startIndex =
      (currentPage - 1) * PRODUCTS_PER_PAGE;

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
      value: filteredProducts.filter(
        (product) => product.featured
      ).length,
      icon: Star,
    },
    {
      title: "In Stock",
      value: filteredProducts.filter(
        (product) => product.stock > 0
      ).length,
      icon: TrendingUp,
    },
    {
      title: "Out of Stock",
      value: filteredProducts.filter(
        (product) => product.stock <= 0
      ).length,
      icon: Boxes,
    },
  ];

  function handleSearch(event) {
    event.preventDefault();
    setPage(1);
    setSearchQuery(search.trim());
  }

  function handleCategoryChange(value) {
    setCategory(value);
    setPage(1);
  }

  function handleSortChange(value) {
    setSort(value);
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setSearchQuery("");
    setCategory("");
    setSort("");
    setPage(1);
  }

  function handlePageChange(newPage) {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    setPage(newPage);

    requestAnimationFrame(() => {
      if (productsSectionRef.current) {
        const navbarOffset = 110;

        const sectionTop =
          productsSectionRef.current.getBoundingClientRect().top +
          window.scrollY -
          navbarOffset;

        window.scrollTo({
          top: Math.max(0, sectionTop),
          behavior: "smooth",
        });
      }
    });
  }

  return (
    <div className="min-w-0 bg-page text-ink">
      <section className="mb-8 flex flex-col gap-5 rounded-3xl border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-brand/10 p-4 text-brand">
            <Package size={30} />
          </div>

          <div>
            <p className="mb-1 text-xs tracking-[0.35em] text-brand sm:text-sm">
              PRODUCT DASHBOARD
            </p>

            <h1 className="text-3xl font-bold text-ink sm:text-4xl lg:text-5xl">
              Products
            </h1>
          </div>
        </div>

        <Button
          variant="primary"
          className="gap-2 rounded-xl px-6 py-3 font-semibold"
        >
          <Plus size={20} />
          Add Product
        </Button>
      </section>

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

      <section className="mb-8 rounded-3xl border border-line bg-surface p-4 sm:p-6">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 lg:flex-row"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-line bg-page px-4 focus-within:border-accent">
            <Search
              size={20}
              className="shrink-0 text-muted"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search products..."
              aria-label="Search products"
              className="w-full min-w-0 bg-transparent py-4 text-ink outline-none placeholder:text-muted"
            />
          </div>

          <Button
            variant="outline"
            onClick={() =>
              setShowFilters((previous) => !previous)
            }
            aria-expanded={showFilters}
            className="gap-2 rounded-xl px-6 py-4"
          >
            <SlidersHorizontal size={20} />
            Filters
          </Button>

          <Button
            type="submit"
            variant="primary"
            className="gap-2 rounded-xl px-7 py-4 font-semibold"
          >
            <Search size={20} />
            Search
          </Button>
        </form>

        {showFilters && (
          <div className="mt-5 grid grid-cols-1 gap-4 border-t border-line pt-5 sm:grid-cols-2">
            <Dropdown
              id="product-category"
              label="Category"
              value={category}
              options={categories}
              onChange={handleCategoryChange}
            />

            <Dropdown
              id="product-sort"
              label="Sort By"
              value={sort}
              options={sortOptions}
              onChange={handleSortChange}
            />

            <Button
              variant="outline"
              onClick={clearFilters}
              className="gap-2 rounded-xl px-4 py-3 sm:col-span-2"
            >
              <X size={18} />
              Clear Filters
            </Button>
          </div>
        )}
      </section>

      {loading && (
        <div className="flex items-center justify-center gap-3 py-20 text-brand">
          <LoaderCircle className="animate-spin" />
          Loading products...
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-3 rounded-xl border border-danger/30 bg-danger/10 p-5 text-danger">
          <AlertCircle />
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        visibleProducts.length === 0 && (
          <div className="rounded-2xl border border-line bg-surface py-20 text-center text-muted">
            No products found.
          </div>
        )}

      {!loading &&
        !error &&
        visibleProducts.length > 0 && (
          <section
            ref={productsSectionRef}
            className="grid scroll-mt-28 grid-cols-1 gap-6 lg:grid-cols-2"
          >
            {visibleProducts.map((product) => {
              const image = product.images?.[0]?.url;

              return (
                <article
                  key={product._id}
                  className="min-w-0 overflow-hidden rounded-3xl border border-line bg-surface"
                >
                  <div className="relative h-56 bg-page sm:h-72 lg:h-80">
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted">
                        <Package size={60} />
                      </div>
                    )}

                    {product.featured && (
                      <span className="absolute left-4 top-4 rounded-full bg-yellow-400 px-4 py-1 text-sm font-semibold text-black">
                        ★ Featured
                      </span>
                    )}

                    <span
                      className={`absolute bottom-4 right-4 rounded-full border px-4 py-2 text-sm font-semibold ${
                        product.stock > 0
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                          : "border-rose-300 bg-rose-50 text-rose-700"
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of Stock"}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6">
                    <h2 className="mb-2 text-xl font-bold text-ink sm:text-2xl">
                      {product.name}
                    </h2>

                    <p className="mb-5 text-xs uppercase tracking-wider text-muted sm:text-sm">
                      {[
                        product.category,
                        product.subcategory,
                        product.brand,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>

                    <p className="mb-6 min-h-12 text-sm leading-7 text-muted sm:text-base">
                      {product.shortDescription ||
                        product.description ||
                        "No description available."}
                    </p>

                    <div className="mb-5 flex flex-wrap items-center gap-3">
                      <span className="text-3xl font-bold text-ink sm:text-4xl">
                        ${product.price}
                      </span>

                      {product.discountPrice != null &&
                        product.discountPrice <
                          product.price && (
                          <span className="font-semibold text-emerald-600">
                            -$
                            {(
                              product.price -
                              product.discountPrice
                            ).toFixed(2)}{" "}
                            off
                          </span>
                        )}
                    </div>

                    <div className="mb-5 flex flex-wrap gap-2">
                      {product.tags?.map((tag, index) => (
                        <span
                          key={`${tag}-${index}`}
                          className="rounded-lg border border-line bg-page px-3 py-1 text-xs text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3 border-t border-line pt-5">
                      <Button
                        variant="outline"
                        className="gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
                      >
                        <Eye size={17} />
                        View
                      </Button>

                      <Button
                        variant="outline"
                        className="gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
                      >
                        <Pencil size={17} />
                        Edit
                      </Button>

                      <Button
                        variant="outline"
                        className="gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
                      >
                        <SlidersHorizontal size={17} />
                        Quick Edit
                      </Button>

                      <Button
                        variant="danger"
                        className="gap-2 rounded-xl px-4 py-3 text-sm font-semibold sm:ml-auto"
                      >
                        <Trash2 size={17} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

      {!loading && !error && totalPages > 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() =>
              handlePageChange(currentPage - 1)
            }
            className="rounded-xl px-5 py-3 text-sm font-semibold"
          >
            Previous
          </Button>

          <span className="text-sm text-muted">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={currentPage >= totalPages}
            onClick={() =>
              handlePageChange(currentPage + 1)
            }
            className="rounded-xl px-5 py-3 text-sm font-semibold"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProductsList;