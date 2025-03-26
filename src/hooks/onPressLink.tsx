import React, { createContext, useContext, type ReactNode } from 'react';

const OnPressLinkContext = createContext<((url: string) => void) | undefined>(
  undefined
);

export const useOnPressLink = () => {
  const context = useContext(OnPressLinkContext);
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
