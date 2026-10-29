import { Search, SlidersHorizontal, X } from "lucide-react";
import Button from "../../../components/ui/Button";
import Dropdown from "./Dropdown";

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

function ProductsFilters({
  search,
  setSearch,
  category,
  sort,
  showFilters,
  setShowFilters,
  handleSearch,
  handleCategoryChange,
  handleSortChange,
  clearFilters,
}) {
  return (
    <section className="mb-8 rounded-3xl border border-line bg-surface p-4 sm:p-6">
      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-3 lg:flex-row"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-line bg-page px-4 focus-within:border-accent">
          <Search size={20} className="shrink-0 text-muted" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="w-full min-w-0 bg-transparent py-4 text-ink outline-none placeholder:text-muted"
          />
        </div>

        <Button
          variant="outline"
          onClick={() => setShowFilters((previous) => !previous)}
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
  );
}

export default ProductsFilters;
