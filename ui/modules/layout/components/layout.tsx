import { useHeaderSlotValue, useSidebarActiveItem, useTheme, useThemeSync } from "$/core/stores";
import { ButtonToggleProxy } from "$/modules/proxy";
import { Button, cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PropsWithChildren } from "react";

const ITEMS = [
  { icon: "solar:key-bold-duotone", label: "Credentials" },
  { icon: "solar:bomb-emoji-bold-duotone", label: "Models" },
  { icon: "solar:server-2-bold-duotone", label: "Proxy" },
];

export function Layout({ children }: PropsWithChildren) {
  useThemeSync();

  const [theme, setTheme] = useTheme();
  const isDark = theme === "dark";

  const [activeItem, setActiveItem] = useSidebarActiveItem();

  const headerSlot = useHeaderSlotValue();

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <div className="bg-background text-foreground relative flex h-screen w-screen">
      <div className="w-52 shrink-0 py-2 pl-2">
        <aside className="liquid-glass flex h-full flex-col">
          <div className="h-10 w-full" data-tauri-drag-region />
          <div className="flex grow flex-col gap-1 px-2">
            {ITEMS.map((item) => (
              <Button
                key={item.label}
                fullWidth
                variant={activeItem === item.label ? "tertiary" : "ghost"}
                className={cn("justify-start", {
                  "dark:bg-white/15": activeItem === item.label,
                })}
                onClick={() => setActiveItem(item.label)}
              >
                <Icon icon={item.icon} className="text-xl" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>

          <div className="flex gap-2 p-2">
            <Button variant="tertiary" onPress={toggleTheme} isIconOnly className="shrink-0">
              <Icon icon={isDark ? "solar:sun-bold-duotone" : "solar:moon-sleep-bold-duotone"} className="text-xl" />
            </Button>

            <ButtonToggleProxy fullWidth />
          </div>
        </aside>
      </div>

      <main className="ml-2 flex h-full grow flex-col">
        <div className="flex items-center justify-between p-2">
          <span className="text-lg font-medium">{activeItem}</span>

          <div>{headerSlot}</div>
        </div>

        <div className="grow overflow-y-auto px-2">{children}</div>
      </main>
    </div>
  );
}
