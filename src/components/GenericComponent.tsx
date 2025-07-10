import { StepProvider } from "./administration/restaurant_registry/StepContext";
import ButtonPrevious from "./administration/restaurant_registry/ButtonPrevious";
import TabNavigation from "./administration/restaurant_registry/TabNavigation";
import LayoutLoginForm from "../layouts/LayoutLoginForm";
import FormRegistry from "./administration/restaurant_registry/FormRegistry";

function GenericComponent() {
  return (
    <StepProvider> 
      <div>
        <div className="flex flex-col items-center justify-center px-4 text-center">
          <LayoutLoginForm
            BackButtonComponent={<ButtonPrevious />}
            TabNavigationComponent={<TabNavigation />}
            FormComponent={<FormRegistry />}
          />
        </div>
      </div>
    </StepProvider>
  );
}

export default GenericComponent;
