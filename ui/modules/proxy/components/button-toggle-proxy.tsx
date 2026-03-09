import { useProxyControl } from "$/modules/proxy";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

type ButtonToggleProxyProps = {
  fullWidth?: boolean;
};

export function ButtonToggleProxy({ fullWidth = false }: ButtonToggleProxyProps) {
  const { status, toggle } = useProxyControl();

  const isRunning = status === "running";
  const isPending = status === "starting" || status === "stopping";

  return (
    <Button
      variant={isRunning ? "danger" : "primary"}
      fullWidth={fullWidth}
      onPress={toggle}
      isDisabled={isPending}
      isPending={isPending}
    >
      <Icon icon={isRunning ? "solar:stop-bold" : "solar:play-bold"} />
      <span>{isRunning ? "Stop" : "Start"}</span>
    </Button>
  );
}
