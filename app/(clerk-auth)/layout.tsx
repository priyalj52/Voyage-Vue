import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const ClerkLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-screen flex justify-center items-center">{children}</div>
  );
};

export default ClerkLayout;
