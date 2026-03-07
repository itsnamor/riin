import { CredentialItem, useCredentialFilesStore } from "$/core/stores/credential";
import { toast } from "@heroui/react";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export function useCredentialItems() {
  const [items, setItems] = useCredentialFilesStore();

  const [loading, setLoading] = useState(false);

  const loadItems = async () => {
    setLoading(true);
    try {
      const rawItems = await invoke<CredentialItem[]>("read_credentials");
      setItems(rawItems);
    } catch (err) {
      console.error(err);
      toast.danger("Failed to read credential files");
    } finally {
      setLoading(false);
    }
  };

  // oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps
  useEffect(() => (loadItems(), undefined), []);

  return { loading, items, refreshItem: loadItems };
}
