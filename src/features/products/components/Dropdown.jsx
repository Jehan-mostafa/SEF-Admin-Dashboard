import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

function Dropdown({ id, label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption =
    options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleSelect(optionValue) {
    onChange(optionValue);
    setIsOpen(false);
  }

  return (
    <div ref={dropdownRef} className="relative min-w-0">
      <label
        id={`${id}-label`}
        className="mb-2 block text-sm font-medium text-ink"
      >
        {label}
      </label>

      <button
        id={id}
        type="button"
        aria-labelledby={`${id}-label`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-left text-sm text-ink transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="truncate">{selectedOption.label}</span>

        <ChevronDown
          size={18}
          className={`shrink-0 text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-labelledby={`${id}-label`}
          className="absolute left-0 right-0 top-full z-30 mt-2 max-h-60 overflow-y-auto rounded-xl border border-line bg-surface p-1 shadow-xl"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={value === option.value}
              onClick={() => handleSelect(option.value)}
              className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                value === option.value
                  ? "bg-brand/10 font-semibold text-brand"
                  : "text-ink hover:bg-page"
              }`}
            >
              <span>{option.label}</span>

              {value === option.value && (
                <Check size={16} className="shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
