import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getProducts(signal) {
  const response = await axios.get(`${API_BASE_URL}/products`, {
    params: {
      page: 1,
      limit: 100,
    },
    signal,
  });

  const data = response.data;

  if (!data.success || !Array.isArray(data.products)) {
    throw new Error("Invalid products response");
  }

  let allProducts = [...data.products];
  const totalPages = data.totalPages || 1;

  for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
    const nextResponse = await axios.get(`${API_BASE_URL}/products`, {
      params: {
        page: currentPage,
        limit: 100,
      },
      signal,
    });

    const nextData = nextResponse.data;

    if (!nextData.success || !Array.isArray(nextData.products)) {
      throw new Error("Invalid products response");
    }

    allProducts = [...allProducts, ...nextData.products];
  }

  return allProducts;
}
