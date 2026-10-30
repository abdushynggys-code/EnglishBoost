import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "./Icon";

export type SelectOption = { value: string; label: string };

export function SelectMenu({
  label,
  value,
  options,
  onChange,
  placeholder = "Choose an option",
  disabled = false,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  function move(direction: number) {
    if (!options.length) return;
    const current = Math.max(0, options.findIndex((option) => option.value === value));
    onChange(options[(current + direction + options.length) % options.length].value);
  }

  return (
    <label className="field custom-select-field" htmlFor={id}>
      {label}
      <div className="custom-select" ref={root}>
        <button
          id={id}
          type="button"
          className="custom-select-trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          disabled={disabled}
          onClick={() => setOpen(!open)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              move(event.key === "ArrowDown" ? 1 : -1);
              setOpen(true);
            }
          }}
        >
          <span>{selected?.label ?? placeholder}</span><Icon name="down" size={15} />
        </button>
        {open && (
          <div className="custom-select-menu" role="listbox" aria-labelledby={id}>
            {options.length ? options.map((option) => (
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                key={option.value}
                onClick={() => { onChange(option.value); setOpen(false); }}
              >
                <span>{option.label}</span>{option.value === value && <Icon name="check" size={15} />}
              </button>
            )) : <p>{placeholder}</p>}
          </div>
        )}
      </div>
    </label>
  );
}
