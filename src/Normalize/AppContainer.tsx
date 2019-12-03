import React from "react";
import { Normalize, NormalizeProps } from ".";

export interface AppContainerProps extends NormalizeProps {
  children?: React.ReactNode;
}

export function AppContainer(props: AppContainerProps) {
  const { children, ...normalizeProps } = props;
  return (
    <React.Fragment>
      <Normalize {...normalizeProps} />
      {children}
    </React.Fragment>
  );
}
