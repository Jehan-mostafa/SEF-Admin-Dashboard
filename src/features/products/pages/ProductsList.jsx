import { LoaderCircle, AlertCircle } from "lucide-react";
import ProductsHeader from "../components/ProductsHeader";
import ProductsStats from "../components/ProductsStats";
import ProductsFilters from "../components/ProductsFilters";
import ProductCard from "../components/ProductCard";
import ProductsPagination from "../components/ProductsPagination";
import useProducts from "../hooks/useProducts";

function ProductsList() {
  const {
    search,
    setSearch,
    category,
    sort,
    showFilters,
    setShowFilters,
    loading,
    error,
    stats,
    visibleProducts,
    currentPage,
    totalPages,
    productsSectionRef,
    handleSearch,
    handleCategoryChange,
    handleSortChange,
    clearFilters,
    handlePageChange,
  } = useProducts();

  return (
    <div className="min-w-0 bg-page text-ink">
      <ProductsHeader />

      <ProductsStats stats={stats} />

      <ProductsFilters
        search={search}
        setSearch={setSearch}
        category={category}
        sort={sort}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        handleSearch={handleSearch}
        handleCategoryChange={handleCategoryChange}
        handleSortChange={handleSortChange}
        clearFilters={clearFilters}
      />

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
            {visibleProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </section>
        )}

      {!loading && !error && totalPages > 1 && (
        <ProductsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default ProductsList;