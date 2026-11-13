import Button from "../../../components/ui/Button";

function ProductsPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
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
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-xl px-5 py-3 text-sm font-semibold"
      >
        Next
      </Button>
    </div>
  );
}

export default ProductsPagination;
