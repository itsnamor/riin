import "$/core/styles/main.css";
import { useSidebarActiveItemValue } from "$/core/stores/layout";
import { Layout } from "$/modules/layout";
import { ScreenProviders } from "$/modules/providers";
import { ScreenProxy } from "$/modules/proxy";
import { Toast } from "@heroui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const activeItem = useSidebarActiveItemValue();

  return (
    <>
      <Toast.Provider placement="bottom end" />
      <Layout>
        {activeItem === "Proxy" && <ScreenProxy />}
        {activeItem === "Providers" && <ScreenProviders />}
      </Layout>
    </>
  );
}

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
