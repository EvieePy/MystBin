import { createContext, JSX, useContext } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";

type PasteStoreT = [PasteCreate, SetStoreFunction<PasteCreate>];

const PasteContext = createContext<PasteStoreT>();

function createPasteStore(): PasteStoreT {
  const [pasteState, setPasteState] = createStore({
    files: []
  });

  return [pasteState, setPasteState] as PasteStoreT;
}

interface PasteProviderP {
  children: JSX.Element;
}

export function PasteProvider(props: PasteProviderP) {
  const store = createPasteStore();
  return <PasteContext.Provider value={store}>{props.children}</PasteContext.Provider>;
}

export function usePasteContext(): PasteStoreT {
  const context = useContext(PasteContext);

  if (!context) {
    throw new Error("PasteContext can only be used within a PasteStoreProvider.");
  }

  return context;
}
