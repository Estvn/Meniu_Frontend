"use client";

interface FormFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  step?: string;
  required?: boolean;
  containerClassName?: string;
}

export function FormField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  step,
  required = false,
  containerClassName = "",
}: FormFieldProps) {
  return (
    <div
      className={`flex relative flex-col gap-1.5 items-start self-stretch ${containerClassName}`}
    >
      <label className="flex relative flex-col items-start self-stretch">
        <span className="relative self-stretch text-xs leading-5 text-gray-700 max-sm:text-xs">
          {label}
        </span>
      </label>
      <div className="flex relative flex-col items-start self-stretch px-2.5 pt-2.5 pb-2.5 bg-white rounded-md border-gray-300 border-solid border-[0.839px]">
        <input
          type={type}
          step={step}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="relative self-stretch text-xs text-neutral-500 max-sm:text-xs bg-transparent border-none outline-none w-full"
        />
      </div>
    </div>
  );
}
