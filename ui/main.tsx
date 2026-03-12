import "$/core/icon/config";
import "$/core/styles/main.css";
import { useSidebarActiveItemValue } from "$/core/stores/layout";
import { ScreenAccounts } from "$/modules/accounts";
import { Layout } from "$/modules/layout";
import { ScreenModels } from "$/modules/models";
import { ScreenProxy } from "$/modules/proxy";
import { Toast } from "@heroui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const activeItem = useSidebarActiveItemValue();

  return (
    <>
      <Layout>
        {activeItem === "Proxy" && <ScreenProxy />}
        {activeItem === "Accounts" && <ScreenAccounts />}
        {activeItem === "Models" && <ScreenModels />}
      </Layout>

      <Toast.Provider placement="bottom end" />
    </>
  );
}

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
