import { useEffect, useMemo, useRef, useState } from "react";
import { Package, Star, TrendingUp, Boxes } from "lucide-react";
import { getProducts } from "../../../api/getProducts";

const PRODUCTS_PER_PAGE = 10;

function useProducts() {
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
        const allProducts = await getProducts(controller.signal);

        if (!controller.signal.aborted) {
          setProducts(allProducts);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
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

  return {
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
  };
}

export default useProducts;
