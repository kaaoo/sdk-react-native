import React, { createContext, useContext, type ReactNode } from 'react';

const OnPressLinkContext = createContext<((url: string) => void) | undefined>(
  undefined
);

export const useOnPressLink = () => {
  const context = useContext(OnPressLinkContext);
  if (!context) {
    throw new Error('useOnPressLink must be used within a OnPressLinkProvider');
  }
  return context;
};

export const OnPressLinkProvider = ({
  children,
  onPressLink,
}: {
  children: ReactNode;
  onPressLink: ((url: string) => void) | undefined;
}) => {
  return (
    <OnPressLinkContext.Provider value={onPressLink}>
      {children}
    </OnPressLinkContext.Provider>
  );
};
