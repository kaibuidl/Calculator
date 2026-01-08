
import React from 'react';
import { ButtonType } from '../types';

interface CalculatorButtonProps {
  label: React.ReactNode;
  onClick: () => void;
  type: ButtonType;
  isActive?: boolean;
}

export const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  label,
  onClick,
  type,
  isActive = false
}) => {
  const getBaseClasses = () => {
    switch (type) {
      case ButtonType.OPERATOR:
        return isActive
          ? 'bg-white text-[#ff9f0a]'
          : 'bg-[#ff9f0a] text-white hover:bg-[#ffb340] active:bg-[#cc7f08]';
      case ButtonType.FUNCTION:
        return 'bg-[#505050] text-white hover:bg-[#707070] active:bg-[#404040]';
      case ButtonType.NUMBER:
      default:
        return 'bg-[#333333] text-white hover:bg-[#505050] active:bg-[#202020]';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-[68px] h-[68px] md:w-[72px] md:h-[72px] 
        rounded-full flex items-center justify-center 
        text-2xl md:text-3xl font-normal transition-colors duration-150
        ${getBaseClasses()}
      `}
    >
      {label}
    </button>
  );
};
