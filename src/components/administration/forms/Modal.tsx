"use client";
import * as React from "react";
import { CloseIcon } from "./CloseIcon";

interface ModalProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export function Modal({ children, onClose }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.18)" }}
    >
      <div className="flex relative flex-col shrink-0 gap-3.5 items-start p-5 bg-white rounded-md shadow-2xl max-w-[376px] w-[376px] max-md:mx-auto max-md:my-0 max-md:max-w-[400px] max-md:w-[90%] max-sm:p-4 max-sm:mx-auto max-sm:my-0 max-sm:max-w-[350px] max-sm:w-[95%]">
        {children}

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex absolute flex-col items-start p-1 rounded right-[13.429px] top-[13.429px] hover:bg-gray-100 transition-colors"
            aria-label="Cerrar modal"
          >
            <CloseIcon />
          </button>
        )}
      </div>
    </div>
  );
}
