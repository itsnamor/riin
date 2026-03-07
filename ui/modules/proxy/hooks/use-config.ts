import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "@heroui/react";
import { parse, stringify } from "yaml";
import { useConfigStore } from "$/core/stores/config";

export function useConfig() {
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);

  const [config, setConfig] = useConfigStore();

  useEffect(() => {
    setLoading(true);
    invoke<string>("read_config")
      .then((raw) => {
        const parsed = parse(raw);
        setConfig(parsed);
      })
      .catch((err) => {
        console.error(err);
        toast.danger("Failed to load config");
      })
      .finally(() => setLoading(false));
  }, [setConfig]);

  const applyConfig = async () => {
    setApplying(true);

    const current = parse(await invoke<string>("read_config")) ?? {};
    const newConfig = { ...current, ...config };

    await invoke("write_config", { content: stringify(newConfig) });
    setApplying(false);

    toast.success("Config applied successfully");
  };

  return { loading, applying, config, setConfig, applyConfig };
}
