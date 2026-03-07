import { Button, InputGroup } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ChangeEvent, useState } from "react";

type FieldListTextProps = {
  value?: string[];
  onChange?: (value: string[]) => void;
};

export function FieldListText({ value: outerValue, onChange }: FieldListTextProps) {
  const [innerValue, setInnerValue] = useState<string[]>([]);

  const value = outerValue ? outerValue : innerValue;

  const hasEmpty = value.some((item) => item.trim() === "");

  const handleChange = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>, idx: number) => {
    const inputValue = e.target.value;

    const newValue = value.map((item, i) => (i === idx ? inputValue : item));

    setInnerValue(newValue);
    onChange?.(newValue);
  };

  const handleAdd = () => {
    const newValue = [...value, ""];

    setInnerValue(newValue);
    onChange?.(newValue);
  };

  const handleRemove = (idx: number) => {
    const newValue = value.filter((_, i) => i !== idx);

    setInnerValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex flex-col gap-2">
      {value.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1">
          <InputGroup className="flex grow gap-1">
            <InputGroup.Input
              value={item}
              className="grow"
              placeholder="sk-•••••"
              onChange={(e) => handleChange(e, idx)}
            />

            <InputGroup.Suffix className="px-1">
              <Button variant="ghost" isIconOnly size="sm" className="shrink-0">
                <Icon icon="solar:copy-bold-duotone" />
              </Button>
            </InputGroup.Suffix>
          </InputGroup>

          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            className="text-danger shrink-0"
            onClick={() => handleRemove(idx)}
          >
            <Icon icon="solar:trash-bin-2-bold-duotone" />
          </Button>
        </div>
      ))}

      <Button fullWidth variant="secondary" className="rounded-xl" onClick={handleAdd} isDisabled={hasEmpty}>
        Add
      </Button>
    </div>
  );
}
