import React from "react";

type FlexBetweenProps = {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
};

const FlexBetween: React.FC<FlexBetweenProps> = ({ 
  className = "", 
  children,
  ...props 
}) => {
  return (
    <div 
      className={`flex justify-between items-center ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default FlexBetween;
