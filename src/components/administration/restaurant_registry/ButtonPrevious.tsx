"use client";

import { useStepContext } from "./StepContext";

function ButtonPrevious() {
  const { step, prevStep, handleStepTransition } = useStepContext();

  const handlePrevious = () => {
    if (step > 0) {
      handleStepTransition(prevStep);
    }
  };

  if(step > 0) {
    return (
      <div >
        <button
          onClick={handlePrevious}
          className="box-border flex gap-2 items-center py-2.5 pr-5 pl-3 h-10 bg-white rounded-md border border-solid cursor-pointer border-stone-300
                  transition-colors duration-300 ease-in-out
                  hover:bg-orange-500 hover:border-orange-500
                  group"
          type="button"
          aria-label="Volver"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-colors duration-300 ease-in-out
                      stroke-black group-hover:stroke-white"
          >
            <path
              d="M15 18L9 12L15 6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm font-medium leading-5 text-center text-black
                          transition-colors duration-300 ease-in-out
                          group-hover:text-white">
            Anterior
          </span>
        </button>
      </div>
    );
  }
}

export default ButtonPrevious;
