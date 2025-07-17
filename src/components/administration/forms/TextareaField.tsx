"use client";

interface TextareaFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function TextareaField({
  label,
  placeholder,
  value,
  onChange,
  required = false,
}: TextareaFieldProps) {
  return (
    <div className="flex relative flex-col gap-1.5 items-start self-stretch">
      <label className="flex relative flex-col items-start self-stretch">
        <span className="relative self-stretch text-xs leading-5 text-gray-700 max-sm:text-xs">
          {label}
        </span>
      </label>
      <div className="flex relative flex-col items-start self-stretch px-2.5 pt-2 pb-10 bg-white rounded-md border-gray-300 border-solid border-[0.839px] min-h-[67px]">
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="relative self-stretch text-xs leading-5 text-neutral-500 max-sm:text-xs bg-transparent border-none outline-none w-full resize-none"
          rows={3}
        />
      </div>
    </div>
  );
}
