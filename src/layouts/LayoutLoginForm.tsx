"use client";

interface LayoutLoginFormProps {
  BackButtonComponent: React.ReactNode;
  TabNavigationComponent: React.ReactNode;
  FormComponent: React.ReactNode;
}

function LayoutLoginForm({ BackButtonComponent, TabNavigationComponent, FormComponent }: LayoutLoginFormProps) {
  return (
    <main >
      <div className="flex flex-col items-start w-full max-w-[412px] gap-2 xs:pt-4 sm:gap-3 md:gap-3 lg:gap-3 pt-4 sm:pt-8 md:pt-14 lg:pt-16 xl:pt-22 2xl:pt-28 pb-4 sm:pb-6 md:pb-10 lg:pb-24 xl:pb-44 2xl:pb-52">
        
        {BackButtonComponent}
        
        <div className="w-full bg-white rounded-lg border border-solid shadow-sm border-zinc-200">
          
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/278def48019329516731a192fe60f82e54d8c51e?width=235"
            alt="Logo"
            className="mt-3 sm:mt-4 md:mt-6 lg:mt-9 mb-3 sm:mb-4 md:mb-6 mx-auto h-[28px] sm:h-[32px] md:h-[36px] lg:h-[40px] xl:h-[43px] w-[76px] sm:w-[87px] md:w-[98px] lg:w-[109px] xl:w-[117px]"
          />

          {TabNavigationComponent}
          {FormComponent}

        </div>
      </div>
    </main>
  );
}

export default LayoutLoginForm;