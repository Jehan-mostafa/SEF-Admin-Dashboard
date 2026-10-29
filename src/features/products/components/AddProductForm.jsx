import React, { useEffect, useRef, useState } from "react";
import { createProduct } from "../services/productService";

const initialFormData = {
  name: "",
  shortDescription: "",
  description: "",
  price: "",
  discountPrice: "",
  stock: "",
  category: "",
  brand: "",
  sku: "",
};

function getErrorMessage(error) {
  const data = error.response?.data;

  if (typeof data?.message === "string") return data.message;
  if (typeof data?.error === "string") return data.error;

  if (Array.isArray(data?.errors)) {
    return data.errors
      .map((item) => item?.message || item?.msg || "")
      .filter(Boolean)
      .join(" ");
  }

  if (data?.errors && typeof data.errors === "object") {
    return Object.values(data.errors)
      .flat()
      .map((item) =>
        typeof item === "string" ? item : item?.message || ""
      )
      .filter(Boolean)
      .join(" ");
  }

  if (!error.response) {
    return "Unable to connect to the server. Please try again.";
  }

  return "Something went wrong. Please try again.";
}

export default function AddProductForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const imageUrls = useRef(new Set());
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      imageUrls.current.forEach((url) => URL.revokeObjectURL(url));
      imageUrls.current.clear();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setError("");
    setSuccessMessage("");
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";

    if (images.length + files.length > 5) {
      setError("You can upload a maximum of 5 images.");
      return;
    }

    if (files.some((file) => !file.type.startsWith("image/"))) {
      setError("Please select valid image files.");
      return;
    }

    const newPreviews = files.map((file) => {
      const url = URL.createObjectURL(file);
      imageUrls.current.add(url);
      return url;
    });

    setImages((previous) => [...previous, ...files]);
    setImagePreviews((previous) => [...previous, ...newPreviews]);
    setError("");
    setSuccessMessage("");
  };

  const removeImage = (index) => {
    const url = imagePreviews[index];

    if (url) {
      URL.revokeObjectURL(url);
      imageUrls.current.delete(url);
    }

    setImages((previous) => previous.filter((_, i) => i !== index));
    setImagePreviews((previous) => previous.filter((_, i) => i !== index));
    setError("");
  };

  const resetForm = () => {
    setFormData({ ...initialFormData });

    imagePreviews.forEach((url) => {
      URL.revokeObjectURL(url);
      imageUrls.current.delete(url);
    });

    setImages([]);
    setImagePreviews([]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (images.length === 0) {
      setError("Please upload at least one product image.");
      return;
    }

    if (!Number.isFinite(Number(formData.price)) || Number(formData.price) <= 0) {
      setError("Please enter a valid product price.");
      return;
    }

    if (
      formData.discountPrice !== "" &&
      (!Number.isFinite(Number(formData.discountPrice)) ||
        Number(formData.discountPrice) < 0)
    ) {
      setError("Please enter a valid discounted price.");
      return;
    }

    if (!Number.isInteger(Number(formData.stock)) || Number(formData.stock) < 0) {
      setError("Stock must be a non-negative whole number.");
      return;
    }

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "") data.append(key, value);
    });

    images.forEach((image) => data.append("images", image));

    setLoading(true);

    try {
      await createProduct(data);
      resetForm();
      setSuccessMessage("Product created successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 dark:border-slate-700 " +
    "bg-white dark:bg-slate-800 text-slate-900 dark:text-white " +
    "px-3.5 py-2.5 text-sm outline-none transition " +
    "focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <h2 className="mb-6 text-xl font-bold text-slate-800 dark:text-white">
        Add New Product
      </h2>

      {error && (
        <div role="alert" className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div role="status" className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelClass} htmlFor="name">Product Name *</label>
          <input id="name" name="name" value={formData.name} onChange={handleChange}
            className={inputClass} placeholder="Wireless Headphones" required />
        </div>

        <div>
          <label className={labelClass} htmlFor="shortDescription">Short Description *</label>
          <input id="shortDescription" name="shortDescription" value={formData.shortDescription}
            onChange={handleChange} className={inputClass}
            placeholder="High-quality wireless headphones" required />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="price">Price ($) *</label>
            <input id="price" name="price" type="number" min="0.01" step="0.01"
              value={formData.price} onChange={handleChange} className={inputClass}
              placeholder="299.99" required />
          </div>

          <div>
            <label className={labelClass} htmlFor="discountPrice">Discount Price ($)</label>
            <input id="discountPrice" name="discountPrice" type="number" min="0" step="0.01"
              value={formData.discountPrice} onChange={handleChange} className={inputClass}
              placeholder="249.99" />
          </div>

          <div>
            <label className={labelClass} htmlFor="stock">Stock Quantity *</label>
            <input id="stock" name="stock" type="number" min="0" step="1"
              value={formData.stock} onChange={handleChange} className={inputClass}
              placeholder="50" required />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="category">Category *</label>
            <input id="category" name="category" value={formData.category}
              onChange={handleChange} className={inputClass}
              placeholder="Electronics" required />
          </div>

          <div>
            <label className={labelClass} htmlFor="brand">Brand</label>
            <input id="brand" name="brand" value={formData.brand}
              onChange={handleChange} className={inputClass} placeholder="Brand name" />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="sku">SKU (Stock Keeping Unit)</label>
            <input id="sku" name="sku" value={formData.sku}
              onChange={handleChange} className={inputClass} placeholder="WH-001" />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="description">Detailed Description *</label>
          <textarea id="description" name="description" rows={4}
            value={formData.description} onChange={handleChange} className={inputClass}
            placeholder="Enter the full product description..." required />
        </div>

        <div>
          <label className={labelClass} htmlFor="images">Product Images * (Maximum 5)</label>
          <input ref={fileInputRef} id="images" type="file" multiple accept="image/*"
            onChange={handleImagesChange}
            className="block w-full cursor-pointer text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:font-semibold file:text-teal-700 hover:file:bg-teal-100" />

          <p className="mt-2 text-xs text-slate-500">{images.length} of 5 images selected</p>

          <div className="mt-3 flex flex-wrap gap-3">
            {imagePreviews.map((src, index) => (
              <div key={src} className="relative h-20 w-20 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                <img src={src} alt={`Product preview ${index + 1}`} className="h-full w-full object-cover" />
                <button type="button" onClick={() => removeImage(index)}
                  aria-label={`Remove image ${index + 1}`}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white hover:bg-rose-700">
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full rounded-lg bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 active:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? "Creating Product..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
