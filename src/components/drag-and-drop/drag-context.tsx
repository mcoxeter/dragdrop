import React from 'react';

export type targetSideType = 'before' | 'after';

export type Reorder = {
  sourceIndex: number;
  targetIndex: number;
  targetSide?: targetSideType;
};

export type DragContextType = {
  onReorder?: (move: Pick<Reorder, 'sourceIndex' | 'targetIndex'>) => void;
  reorder?: Reorder;
  setReorder: React.Dispatch<React.SetStateAction<Reorder | undefined>>;
};

const DragContext = React.createContext<DragContextType | null>(null);

export function useDragContext() {
  const context = React.useContext(DragContext);
  if (!context) {
    throw new Error('useDragContext must be used within a DragProvider');
  }
  return context as DragContextType;
}

export type DragProviderProps = {
  children: React.ReactNode;
  onReorder?: (move: Pick<Reorder, 'sourceIndex' | 'targetIndex'>) => void;
};
export function DragProvider({ children, onReorder }: DragProviderProps) {
  const [reorder, setReorder] = React.useState<Reorder | undefined>(undefined);

  return (
    <DragContext.Provider
      value={{
        reorder,
        setReorder,
        onReorder
      }}
    >
      {children}
    </DragContext.Provider>
  );
}
