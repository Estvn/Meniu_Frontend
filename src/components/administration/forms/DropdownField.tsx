"use client";
import { DropdownIcon } from "./DropdownIcon";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownFieldProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  containerClassName?: string;
}

export function DropdownField({
  label,
  options,
  value,
  onChange,
  containerClassName = "",
}: DropdownFieldProps) {
  return (
    <div
      className={`flex relative flex-col gap-1.5 items-start self-stretch ${containerClassName}`}
    >
      <label className="flex relative flex-col items-start self-stretch">
        <span className="relative self-stretch text-xs leading-5 text-gray-700 max-sm:text-xs">
          {label}
        </span>
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex relative gap-0.5 justify-center items-start self-stretch pt-2 pr-8 pb-2.5 pl-3 bg-white rounded-md border-gray-300 border-solid border-[0.839px] h-[33px] w-full text-xs text-neutral-500 max-sm:text-xs appearance-none cursor-pointer"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <DropdownIcon />
        </div>
      </div>
    </div>
  );
}
