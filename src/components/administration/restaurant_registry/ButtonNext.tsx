"use client";

interface props {
  onClick?: () => void;
  disabled?: boolean;
  text?: string;
}

function ButtonNext({ onClick, disabled = false, text = ""}: props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex justify-center items-center px-0 py-3 h-10 bg-orange-500 rounded-md cursor-pointer border-none w-[303px] max-sm:w-full hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed transition-colors"
      type="submit"
    >
      <span className="text-sm font-medium leading-5 text-center text-neutral-50">
        {text}
      </span>
    </button>
  );
}

export default ButtonNext;
