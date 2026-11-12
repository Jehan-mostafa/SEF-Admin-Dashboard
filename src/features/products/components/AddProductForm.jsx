import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { createProduct } from "../services/productService";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Label from "../../../components/ui/Label";

const initialFormData = {
  name: "",
  shortDescription: "",
  description: "",
  price: "",
  discountPrice: "",
  stock: "",
  sku: "",
  category: "",
  subcategory: "",
  brand: "",
  featured: false,
  isActive: true,
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

  if (!error.response) {
    return "Unable to connect to the server. Please try again.";
  }

  if (error.response.status === 401 || error.response.status === 403) {
    return "Admin authentication is required to create a product.";
  }

  return "Something went wrong. Please try again.";
}

const fields = [
  {
    name: "name",
    label: "Product Name",
    placeholder: "Wireless Headphones",
    required: true,
  },
  {
    name: "shortDescription",
    label: "Short Description",
    placeholder: "High-quality wireless headphones",
    required: true,
  },
  {
    name: "price",
    label: "Price ($)",
    type: "number",
    placeholder: "299.99",
    required: true,
    min: "0.01",
    step: "0.01",
  },
  {
    name: "discountPrice",
    label: "Discount Price ($)",
    type: "number",
    placeholder: "249.99",
    min: "0",
    step: "0.01",
  },
  {
    name: "stock",
    label: "Stock Quantity",
    type: "number",
    placeholder: "50",
    required: true,
    min: "0",
    step: "1",
  },
  {
    name: "category",
    label: "Category",
    placeholder: "Electronics",
    required: true,
  },
  {
    name: "subcategory",
    label: "Subcategory",
    placeholder: "Headphones",
  },
  {
    name: "brand",
    label: "Brand",
    placeholder: "Sony",
  },
  {
    name: "sku",
    label: "SKU",
    placeholder: "WH-001",
  },
];

export default function AddProductForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  const imageUrls = useRef(new Set());
  const fileInputRef = useRef(null);

  useEffect(() => {
    const urls = imageUrls.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addTag = () => {
    const value = tagInput.trim().replace(/,$/, "");

    if (!value) return;

    if (tags.some((tag) => tag.toLowerCase() === value.toLowerCase())) {
      toast.info("This tag already exists.");
      return;
    }

    setTags((previous) => [...previous, value]);
    setTagInput("");
  };

  const handleTagKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag();
    }
  };

  const removeTag = (index) => {
    setTags((previous) => previous.filter((_, i) => i !== index));
  };

  const handleImagesChange = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (images.length + files.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }

    if (files.some((file) => !file.type.startsWith("image/"))) {
      toast.error("Please select valid image files.");
      return;
    }

    const previews = files.map((file) => {
      const url = URL.createObjectURL(file);
      imageUrls.current.add(url);
      return url;
    });

    setImages((previous) => [...previous, ...files]);
    setImagePreviews((previous) => [...previous, ...previews]);
  };

  const removeImage = (index) => {
    const url = imagePreviews[index];

    if (url) {
      URL.revokeObjectURL(url);
      imageUrls.current.delete(url);
    }

    setImages((previous) => previous.filter((_, i) => i !== index));
    setImagePreviews((previous) => previous.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({ ...initialFormData });

    imagePreviews.forEach((url) => {
      URL.revokeObjectURL(url);
      imageUrls.current.delete(url);
    });

    setImages([]);
    setImagePreviews([]);
    setTags([]);
    setTagInput("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    const requiredFields = [
      ["name", "Product name is required."],
      ["shortDescription", "Short description is required."],
      ["description", "Detailed description is required."],
      ["category", "Category is required."],
    ];

    for (const [field, message] of requiredFields) {
      if (!formData[field].trim()) {
        toast.error(message);
        return;
      }
    }

    if (images.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    if (!Number.isFinite(Number(formData.price)) || Number(formData.price) <= 0) {
      toast.error("Please enter a valid product price.");
      return;
    }

    if (
      formData.discountPrice !== "" &&
      (!Number.isFinite(Number(formData.discountPrice)) ||
        Number(formData.discountPrice) < 0)
    ) {
      toast.error("Please enter a valid discounted price.");
      return;
    }

    if (!Number.isInteger(Number(formData.stock)) || Number(formData.stock) < 0) {
      toast.error("Stock must be a non-negative whole number.");
      return;
    }

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        data.append(key, String(value));
      }
    });

    data.append("tags", JSON.stringify(tags));

    images.forEach((image) => {
      data.append("images", image);
    });

    setLoading(true);

    try {
      await createProduct(data);
      resetForm();
      toast.success("Product created successfully.");
    } catch (error) {
      console.error("Create Product Error:", error);

      const status = error.response?.status;
      const responseData = error.response?.data;

      const message =
        responseData?.message ||
        responseData?.error ||
        (typeof responseData === "string" ? responseData : "") ||
        error.message ||
        getErrorMessage(error);

      toast.error(
        status
          ? `Error ${status}: ${message}`
          : `Connection error: ${message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "mb-4";

  return (
    <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <h2 className="mb-6 text-xl font-bold text-slate-800 dark:text-white">
        Add New Product
      </h2>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.name} className={inputClass}>
              <Label htmlFor={field.name} required={field.required}>
                {field.label}
              </Label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type || "text"}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required}
                min={field.min}
                step={field.step}
              />
            </div>
          ))}
        </div>

        <div>
          <Label htmlFor="description" required>
            Detailed Description
          </Label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter the full product description..."
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div>
          <Label htmlFor="tags">Tags</Label>
          <div className="flex w-full items-center gap-2">
            <Input
              id="tags"
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Type a tag and press Enter"
              className="min-w-0 flex-1"
            />
            <Button
              type="button"
              onClick={addTag}
              className="w-20 shrink-0 rounded-lg px-3 py-2.5 text-sm font-semibold"
            >
              Add
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-sm text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  aria-label={`Remove ${tag}`}
                  className="font-bold hover:text-rose-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="accent-teal-600"
            />
            Featured Product
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="accent-teal-600"
            />
            Active Product
          </label>
        </div>

        <div>
          <Label htmlFor="images" required>
            Product Images (Maximum 5)
          </Label>
          <input
            ref={fileInputRef}
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImagesChange}
            className="block w-full cursor-pointer text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:font-semibold file:text-teal-700 hover:file:bg-teal-100"
          />

          <p className="mt-2 text-xs text-slate-500">
            {images.length} of 5 images selected
          </p>

          <div className="mt-3 flex flex-wrap gap-3">
            {imagePreviews.map((src, index) => (
              <div
                key={src}
                className="relative h-20 w-20 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <img
                  src={src}
                  alt={`Product preview ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  aria-label={`Remove image ${index + 1}`}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white hover:bg-rose-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg px-4 py-3 text-sm font-semibold shadow-sm"
        >
          {loading ? "Creating Product..." : "Create Product"}
        </Button>
      </form>
    </div>
  );
}
