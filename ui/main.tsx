import "$/core/styles/main.css";
import { useSidebarActiveItemValue } from "$/core/stores/layout";
import { Configuration } from "$/modules/configuration";
import { Layout } from "$/modules/layout";
import { Providers } from "$/modules/providers";
import { Toast } from "@heroui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const activeItem = useSidebarActiveItemValue();

  return (
    <>
      <Toast.Provider placement="bottom end" />
      <Layout>
        {activeItem === "Configuration" && <Configuration />}
        {activeItem === "Providers" && <Providers />}
      </Layout>
    </>
  );
}

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
