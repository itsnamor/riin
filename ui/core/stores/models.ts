import { Model } from "$/core/types";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

const atomModels = atom<Model[]>([]);

export const useModelsStore = () => useAtom(atomModels);
export const useModelsValue = () => useAtomValue(atomModels);
export const useSetModels = () => useSetAtom(atomModels);
