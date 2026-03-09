import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

type ButtonRefreshProps = {
  onClick?: () => void;
  isDisabled?: boolean;
  isPending?: boolean;
};

export function ButtonRefresh({ onClick, isDisabled, isPending }: ButtonRefreshProps) {
  return (
    <Button variant="tertiary" isIconOnly size="sm" onClick={onClick} isDisabled={isDisabled} isPending={isPending}>
      <Icon icon="solar:restart-line-duotone" />
    </Button>
  );
}
