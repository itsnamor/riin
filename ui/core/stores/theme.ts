import { Theme } from "$/core/types";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

export const atomTheme = atom<Theme>("light");

export const useTheme = () => useAtom(atomTheme);
export const useThemeValue = () => useAtomValue(atomTheme);
export const useSetTheme = () => useSetAtom(atomTheme);

export function useThemeSync() {
  const theme = useThemeValue();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.setAttribute("data-theme", theme);
  }, [theme]);
}
