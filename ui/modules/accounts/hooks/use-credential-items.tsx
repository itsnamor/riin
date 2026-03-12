import { useCredentialFilesStore } from "$/core/stores/credential";
import type { CredentialItem } from "$/core/types";
import { toast } from "@heroui/react";
import { invoke } from "@tauri-apps/api/core";
import { useCallback, useEffect, useState } from "react";

export function useCredentialItems() {
  const [items, setItems] = useCredentialFilesStore();

  const [loading, setLoading] = useState(false);

  const loadItems = useCallback(async () => {
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
  }, [setItems]);

  useEffect(() => (loadItems(), undefined), [loadItems]);

  return { loading, items, refreshItem: loadItems };
}
