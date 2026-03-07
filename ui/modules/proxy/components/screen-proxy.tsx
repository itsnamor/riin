import { useSetHeaderSlot } from "$/core/stores/layout";
import { FieldLayout, FieldListText } from "$/modules/form";
import { ButtonApplyConfig } from "$/modules/proxy/components/button-apply-config";
import { NumberField } from "@heroui/react";

export function ScreenProxy() {
  useSetHeaderSlot(<ButtonApplyConfig />);

  return (
    <div className="py-2">
      <div className="flex flex-col gap-6">
        <FieldLayout label="Listen port" description="TCP port the local API Proxy listens on">
          <NumberField defaultValue={8386} formatOptions={{ useGrouping: false }} minValue={0}>
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input className="text-center" />
              <NumberField.IncrementButton />
            </NumberField.Group>
          </NumberField>
        </FieldLayout>

        <FieldLayout label="API Keys" direction="vertical">
          <FieldListText />
        </FieldLayout>
      </div>
    </div>
  );
}
