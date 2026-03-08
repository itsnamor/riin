import { Config } from "$/core/stores/config";
import { useSetHeaderSlot } from "$/core/stores/layout";
import { FieldLayout, FieldListText } from "$/modules/form";
import { ButtonApplyConfig } from "$/modules/proxy/components/button-apply-config";
import { useConfig } from "$/modules/proxy/hooks/use-config";
import { Button, NumberField, Spinner, Select, ListBox } from "@heroui/react";
import { Icon } from "@iconify/react";

export function ScreenProxy() {
  const { config, loading, applying, setConfig, applyConfig, refreshConfig } = useConfig();

  useSetHeaderSlot(
    <div className="flex gap-1">
      <Button
        variant="tertiary"
        isIconOnly
        size="sm"
        onClick={refreshConfig}
        isDisabled={loading || applying}
        isPending={loading}
      >
        <Icon icon="solar:restart-line-duotone" />
      </Button>
      <ButtonApplyConfig onClick={applyConfig} isPending={applying} isDisabled={loading || applying} />
    </div>,
  );

  if (loading) {
    return (
      <div className="flex justify-center gap-4">
        <Spinner />
      </div>
    );
  }

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

        <FieldLayout label="API Keys" direction="vertical">
          <FieldListText value={config["api-keys"]} onChange={(keys) => setConfig({ "api-keys": keys })} />
        </FieldLayout>

        <FieldLayout label="Routing strategy" description="For selecting credentials when multiple match">
          <Select
            value={config.routing.strategy}
            onChange={(strategy) => setConfig({ routing: { strategy: strategy as Config["routing"]["strategy"] } })}
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="round-robin" textValue="Round robin">
                  Round robin
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="fill-first" textValue="Fill first">
                  Fill first
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </FieldLayout>
      </div>
    </div>
  );
}
