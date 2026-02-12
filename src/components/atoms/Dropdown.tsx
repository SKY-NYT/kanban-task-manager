import { useState, useRef, useEffect } from "react";
import { Text } from "./Text";

interface Option { label: string; value: string; }

interface DropdownProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function Dropdown({ options, value, onChange, label, placeholder = "Select...", className = "" }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const clickOut = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", clickOut);
    return () => document.removeEventListener("mousedown", clickOut);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative w-full flex flex-col gap-2 ${className}`}>
      {label && <Text variant="p4" className="text-gray-400">{label}</Text>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-10 w-full items-center justify-between rounded-sm border px-4 transition-all
          ${isOpen ? "border-primary bg-white" : "border-[#828fa340] bg-transparent"} hover:border-primary`}
      >
        <Text variant="p5" className={!selectedOption ? "text-gray-400" : "text-foreground"}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <svg className={`transition-transform ${isOpen ? "rotate-180" : ""}`} width="11" height="7">
          <path stroke="#635FC7" strokeWidth="2" fill="none" d="m1 1 4 4 4-4"/>
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute top-full z-100 w-full max-h-30 overflow-y-auto rounded-lg bg-white p-4 shadow-[0_10px_20px_0_rgba(54,78,126,0.25)] flex flex-col gap-2">
          {options.map((opt) => (
            <li key={opt.value} onClick={() => { onChange(opt.value); setIsOpen(false); }} className="group cursor-pointer">
              <Text variant="p6" className="text-gray-400 group-hover:text-primary transition-colors">
                {opt.label}
              </Text>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}