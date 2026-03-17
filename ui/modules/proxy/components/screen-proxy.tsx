import { useSetHeaderSlot } from "$/core/stores";
import { ButtonRefresh, Loading } from "$/core/ui";
import { FieldLayout, FieldListText } from "$/modules/form";
import { ButtonApplyConfig, useConfig } from "$/modules/proxy";
import { NumberField } from "@heroui/react";

export function ScreenProxy() {
  const { config, loading, applying, setConfig, applyConfig, refreshConfig } = useConfig();

  useSetHeaderSlot(
    <div className="flex gap-1">
      <ButtonRefresh onClick={refreshConfig} isDisabled={loading || applying} isPending={loading} />
      <ButtonApplyConfig onClick={applyConfig} isPending={applying} isDisabled={loading || applying} />
    </div>,
  );

  if (loading) return <Loading />;

  return (
    <div className="py-2">
      <div className="flex flex-col gap-6">
        <FieldLayout label="Listen port" description="TCP port the local API Proxy listens on">
          <NumberField
            value={config.port}
            onChange={(port) => setConfig({ port })}
            formatOptions={{ useGrouping: false }}
            minValue={0}
          >
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="text-center" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
        </FieldLayout>

        <FieldLayout label="API Keys" description="Client API keys for authenticating to this proxy (optional when disable-auth is true)" direction="vertical">
          <FieldListText value={config["api-keys"]} onChange={(keys) => setConfig({ "api-keys": keys })} />
        </FieldLayout>
      </div>
    </div>
  );
}
