import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { ReactNode, useEffect } from "react";

export const atomActiveItem = atom("Providers");
export const useSidebarActiveItem = () => useAtom(atomActiveItem);
export const useSidebarActiveItemValue = () => useAtomValue(atomActiveItem);
export const useSetSidebarActiveItem = () => useSetAtom(atomActiveItem);

const atomHeaderSlot = atom<ReactNode>(null);
export const useHeaderSlot = () => useAtom(atomHeaderSlot);
export const useHeaderSlotValue = () => useAtomValue(atomHeaderSlot);
export const useSetHeaderSlot = (node?: ReactNode) => {
  const set = useSetAtom(atomHeaderSlot);

  useEffect(() => {
    set(node ?? null);
  }, [node, set]);

  return set;
};
