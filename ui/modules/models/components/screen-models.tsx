import { useSetHeaderSlot } from "$/core/stores/layout";
import { ButtonRefresh } from "$/core/ui";
import { TableModels, useModels } from "$/modules/models";
import { useProxyControl } from "$/modules/proxy";
import { Alert } from "@heroui/react";

export function ScreenModels() {
  const { refreshModels } = useModels();

  useSetHeaderSlot(<ButtonRefresh onClick={refreshModels} />);

  const { status } = useProxyControl();

  if (status !== "running") {
    return (
      <Alert status="danger">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title className="font-light">Please start the proxy to use this feature.</Alert.Title>
        </Alert.Content>
      </Alert>
    );
  }

  return <TableModels />;
}
