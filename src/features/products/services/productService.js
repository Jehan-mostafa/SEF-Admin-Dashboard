import api from "../../../api/api";

export const createProduct = async (formData) => {
  const response = await api.post("/products", formData);
  return response.data;
};
