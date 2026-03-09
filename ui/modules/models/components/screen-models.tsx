import { useSetHeaderSlot } from "$/core/stores/layout";
import { ButtonRefresh } from "$/core/ui";
import { TableModels } from "$/modules/models/components/table-models";
import { useProxyControl } from "$/modules/proxy";
import { Alert } from "@heroui/react";

export function ScreenModels() {
  useSetHeaderSlot(<ButtonRefresh />);

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
