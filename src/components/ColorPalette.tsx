import React from 'react';
import { colorsMap } from '../contants/levels';

type Props = {
  colors: (keyof typeof colorsMap)[];
  disabled?: boolean;
  onClick: (hex: string, key: keyof typeof colorsMap) => void;
};

const ColorPalette = ({ colors, disabled, onClick }: Props) => {
  return (
    <div className="flex flex-wrap gap-4">
      {colors.map(key => {
        const hex = colorsMap[key];
        return (
          <button
            key={key}
            className="w-10 h-10 rounded-full border-2 shadow-sm focus:outline-none"
            style={{ backgroundColor: hex }}
            disabled={disabled}
            onClick={() => onClick(hex, key)}
          />
        );
      })}
    </div>
  );
};

export default ColorPalette;
