import { useSetHeaderSlot } from "$/core/stores/layout";

export function Providers() {
  useSetHeaderSlot(null);

  return <div>Providers</div>;
}
