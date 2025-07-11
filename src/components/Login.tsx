import { StepProvider, useStepContext } from "./administration/restaurant_registry/StepContext";
import ButtonPrevious from "./administration/restaurant_registry/ButtonPrevious";
import TabNavigation from "./administration/restaurant_registry/TabNavigation";
import LayoutLoginForm from "../layouts/LayoutLoginForm";
import FormRegistry from "./administration/restaurant_registry/FormRegistry";
import FormLogin from "./administration/restaurant_registry/FormLogin";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function LoginContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { resetStep } = useStepContext();
  const prevTabRef = useRef(activeTab);

  // Determinar el tab activo basado en la URL
  useEffect(() => {
    const currentTab = location.pathname === "/registro" ? "register" : "login";
    setActiveTab(currentTab);
  }, [location.pathname]);

  useEffect(() => {
    if (prevTabRef.current !== activeTab) {
      resetStep();
      // Limpiar datos del formulario anterior
      if (prevTabRef.current === "login") {
        localStorage.removeItem('login-form-data');
      } else {
        localStorage.removeItem('registry-form-data');
      }
      prevTabRef.current = activeTab;
    }
  }, [activeTab, resetStep]);

  const handleTabChange = (tab: "login" | "register") => {
    setActiveTab(tab);
    // Navegar a la ruta correspondiente
    if (tab === "register") {
      navigate("/registro");
    } else {
      navigate("/");
    }
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
