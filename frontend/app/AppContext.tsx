import { createContext, useContext, useState } from "react";

// ⭐ type
type EmissionItem = {
  type: string;
  value: number;
  date: string;
};

type AppState = {
  totalEmission: number;
  setTotalEmission: React.Dispatch<React.SetStateAction<number>>;

  totalOffset: number;
  setTotalOffset: React.Dispatch<React.SetStateAction<number>>;

  history: EmissionItem[];

  addEmission: (item: EmissionItem) => void;
  deleteEmission: (index: number) => void;
  restoreEmission: (item: EmissionItem, index: number) => void;

  resetAll: () => void;
};

const AppContext = createContext<AppState | null>(null);

export const AppProvider = ({ children }: any) => {
  const [totalEmission, setTotalEmission] = useState(0);
  const [totalOffset, setTotalOffset] = useState(0);
  const [history, setHistory] = useState<EmissionItem[]>([]);

  // ✅ ADD
  const addEmission = (item: EmissionItem) => {
    setHistory((prev) => [item, ...prev]);
    setTotalEmission((prev) => prev + item.value);
  };

  // ✅ DELETE
  const deleteEmission = (index: number) => {
    setHistory((prev) => {
      const item = prev[index];
      if (!item) return prev;

      // update total correctly
      setTotalEmission((t) => Math.max(t - item.value, 0));

      return prev.filter((_, i) => i !== index);
    });
  };

  // ✅ RESTORE (UNDO)
  const restoreEmission = (item: EmissionItem, index: number) => {
    setHistory((prev) => {
      const newArr = [...prev];
      newArr.splice(index, 0, item);

      setTotalEmission((t) => t + item.value);

      return newArr;
    });
  };

  // ✅ RESET
  const resetAll = () => {
    setTotalEmission(0);
    setTotalOffset(0);
    setHistory([]);
  };

  return (
    <AppContext.Provider
      value={{
        totalEmission,
        setTotalEmission,
        totalOffset,
        setTotalOffset,
        history,
        addEmission,
        deleteEmission,
        restoreEmission,
        resetAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("Wrap app with AppProvider");
  return ctx;
};