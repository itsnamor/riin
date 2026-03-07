import { useSetHeaderSlot } from "$/core/stores/layout";

export function ScreenProviders() {
  useSetHeaderSlot(null);

  return <div>Providers</div>;
}
