import { Spinner } from "@heroui/react";

export function Loading() {
  return (
    <div className="flex justify-center gap-4">
      <Spinner />
    </div>
  );
}
