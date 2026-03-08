import { useConfigStore } from "$/core/stores/config";
import { toast } from "@heroui/react";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { parse, stringify } from "yaml";

export function useConfig() {
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);

  const [config, setConfig] = useConfigStore();

  const loadConfig = async () => {
    setLoading(true);
    try {
      const raw = await invoke<string>("read_config");
      const parsed = parse(raw);
      setConfig(parsed);
    } catch (err) {
      console.error(err);
      toast.danger("Failed to load config");
    } finally {
      setLoading(false);
    }
  };

  // oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps
  useEffect(() => (loadConfig(), undefined), []);

  const applyConfig = async () => {
    setApplying(true);

    const current = parse(await invoke<string>("read_config")) ?? {};
    const newConfig = { ...current, ...config };

    await invoke("write_config", { content: stringify(newConfig) });
    setApplying(false);

    toast.success("Config applied successfully");
  };

  return { loading, applying, config, setConfig, applyConfig, refreshConfig: loadConfig };
}
