import {
  Package,
  Eye,
  Pencil,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import Button from "../../../components/ui/Button";

function ProductCard({ product }) {
  const image = product.images?.[0]?.url;

  return (
    <article className="min-w-0 overflow-hidden rounded-3xl border border-line bg-surface">
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
          <span className="absolute left-4 top-4 rounded-full bg-brand px-4 py-1 text-sm font-semibold text-white">
            ★ Featured
          </span>
        )}

        <span
          className={`absolute bottom-4 right-4 rounded-full border px-4 py-2 text-sm font-semibold ${
            product.stock > 0
              ? "border-brand bg-brand/10 text-brand"
              : "border-danger bg-danger/10 text-danger"
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
            product.discountPrice < product.price && (
              <span className="font-semibold text-brand">
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
}

export default ProductCard;
