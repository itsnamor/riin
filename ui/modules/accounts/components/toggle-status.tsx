import { useCredentialFilesStore } from "$/core/stores/credential";
import { Switch, toast } from "@heroui/react";
import { invoke } from "@tauri-apps/api/core";

type ToggleStatusProps = {
  filename: string;
};

export function ToggleStatus({ filename }: ToggleStatusProps) {
  const [items, setItems] = useCredentialFilesStore();
  const item = items.find((i) => i.filename === filename);

  const handleChange = async (checked: boolean) => {
    if (!item) return;

    try {
      const updated = { ...item.credential, disabled: !checked };

      await invoke("write_credential", { filename, credential: updated });
      setItems((prev) => prev.map((i) => (i.filename === filename ? { ...i, credential: updated } : i)));
    } catch (err) {
      console.error(err);
      toast.danger("Failed to update credential status");
    }
  };

  return (
    <Switch size="sm" isSelected={!item?.credential.disabled} onChange={handleChange}>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
    </Switch>
  );
}
