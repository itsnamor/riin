import { cn, Description, Label } from "@heroui/react";
import { PropsWithChildren } from "react";

type FieldLayoutProps = PropsWithChildren<{
  label: string;
  description?: string;
  direction?: "horizontal" | "vertical";
}>;

export function FieldLayout({ label, description, children, direction = "horizontal" }: FieldLayoutProps) {
  return (
    <div className={cn("grid grid-cols-2 items-center gap-2", direction === "vertical" && "grid-cols-1")}>
      <div className="flex flex-col gap-1">
        <Label>{label}</Label>
        <Description>{description}</Description>
      </div>

      <div>{children}</div>
    </div>
  );
}
