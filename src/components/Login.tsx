import { StepProvider, useStepContext } from "./administration/restaurant_registry/StepContext";
import ButtonPrevious from "./administration/restaurant_registry/ButtonPrevious";
import TabNavigation from "./administration/restaurant_registry/TabNavigation";
import LayoutLoginForm from "../layouts/LayoutLoginForm";
import FormRegistry from "./administration/restaurant_registry/FormRegistry";
import FormLogin from "./administration/restaurant_registry/FormLogin";
import { useState, useEffect, useRef } from "react";

function LoginContent() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { resetStep } = useStepContext();
  const prevTabRef = useRef(activeTab);

  useEffect(() => {
    if (prevTabRef.current !== activeTab) {
      resetStep();
      prevTabRef.current = activeTab;
    }
  }, [activeTab, resetStep]);

  const handleTabChange = (tab: "login" | "register") => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center px-4 text-center">
        <LayoutLoginForm
          BackButtonComponent={<ButtonPrevious />}
          TabNavigationComponent={<TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />}
          FormComponent={activeTab === "login" ? <FormLogin /> : <FormRegistry />}
        />
      </div>
    </div>
  );
}

function Login() {
  return (
    <StepProvider> 
      <LoginContent />
    </StepProvider>
  );
}

export default Login;
