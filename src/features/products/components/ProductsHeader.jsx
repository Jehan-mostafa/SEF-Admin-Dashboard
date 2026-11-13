import { Package, Plus } from "lucide-react";
import Button from "../../../components/ui/Button";

function ProductsHeader() {
  return (
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
  );
}

export default ProductsHeader;
