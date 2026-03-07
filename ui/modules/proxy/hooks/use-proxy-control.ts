import { useProxyStatus } from "$/core/stores/server";
import { toast } from "@heroui/react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";

export function useProxyControl() {
  const [status, setStatus] = useProxyStatus();

  useEffect(() => {
    invoke<boolean>("is_proxy_running").then((running) => {
      setStatus(running ? "running" : "stopped");
    });

    const removeListener = listen("proxy-stopped", () => {
      setStatus("stopped");
    });

    return () => {
      removeListener.then((fn) => fn());
    };
  }, [setStatus]);

  const toggle = async () => {
    if (status === "starting" || status === "stopping") return;

    try {
      if (status === "running") {
        setStatus("stopping");
        await invoke("stop_proxy");
        setStatus("stopped");

        return;
      }

      if (status === "stopped") {
        setStatus("starting");
        await invoke("start_proxy");
        setStatus("running");

        return;
      }
    } catch (error) {
      console.error(error);
      toast.danger("Failed to start/stop proxy. Please try again.");
    }
  };

  return { status, toggle };
}
