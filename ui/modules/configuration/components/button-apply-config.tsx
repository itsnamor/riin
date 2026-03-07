import { Button } from "@heroui/react";

type ButtonApplyConfigProps = {
  isDisabled?: boolean;
  isPending?: boolean;
  onClick?: () => void | Promise<void>;
};

export function ButtonApplyConfig({ isDisabled = false, isPending = false, onClick }: ButtonApplyConfigProps) {
  const handleClick = async () => {
    await onClick?.();
  };

  return (
    <Button variant="primary" size="sm" isDisabled={isDisabled || isPending} onClick={handleClick}>
      {isPending ? "Applying..." : "Apply"}
    </Button>
  );
}
