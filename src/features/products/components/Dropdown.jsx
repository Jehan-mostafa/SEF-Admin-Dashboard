import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import Button from "../../../components/ui/Button";

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

      <Button
        id={id}
        variant="outline"
        aria-labelledby={`${id}-label`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((previous) => !previous)}
        className="w-full justify-between gap-3 rounded-xl px-4 py-3 text-left text-sm"
      >
        <span className="truncate">{selectedOption.label}</span>

        <ChevronDown
          size={18}
          className={`shrink-0 text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {isOpen && (
        <div
          role="listbox"
          aria-labelledby={`${id}-label`}
          className="absolute left-0 right-0 top-full z-30 mt-2 max-h-60 overflow-y-auto rounded-xl border border-line bg-surface p-1 shadow-xl"
        >
          {options.map((option) => (
            <Button
              key={option.value}
              variant="outline"
              role="option"
              aria-selected={value === option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full justify-between gap-3 rounded-lg border-0 px-3 py-2.5 text-left text-sm ${
                value === option.value
                  ? "bg-brand/10 font-semibold text-brand"
                  : "text-ink hover:bg-page"
              }`}
            >
              <span>{option.label}</span>

              {value === option.value && (
                <Check size={16} className="shrink-0" />
              )}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;