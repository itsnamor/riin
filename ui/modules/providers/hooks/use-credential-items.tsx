import { CredentialItem, useCredentialFilesStore } from "$/core/stores/credential";
import { toast } from "@heroui/react";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export function useCredentialItems() {
  const [items, setItems] = useCredentialFilesStore();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    invoke<CredentialItem[]>("read_credentials")
      .then(setItems)
      .catch((err) => {
        console.error(err);
        toast.danger("Failed to read credential files");
      })
      .finally(() => setLoading(false));
  }, [setItems]);

  return { loading, items };
}
