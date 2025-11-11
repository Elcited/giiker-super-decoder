export const colorsMap = {
  red: '#e74c3c',
  orange: '#e67e22',
  yellow: '#f1c40f',
  green: '#2ecc71',
  cyan: '#1abc9c',
  blue: '#3498db',
  purple: '#9b59b6',
};

export const lengthToColors: Record<number, Array<keyof typeof colorsMap>> = {
  4: ['red', 'green', 'blue', 'purple'],
  5: ['red', 'green', 'blue', 'purple', 'yellow'],
  6: ['red', 'orange', 'green', 'blue', 'purple', 'yellow'],
  7: ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'],
};

export type LevelConfig = {
  length: number;
  password: Array<keyof typeof colorsMap>;
  maxAttempts: number;
  colors: Array<keyof typeof colorsMap>;
  colorMap: typeof colorsMap;
};

export const levels: Record<number, LevelConfig> = {
  1: {
    length: 4,
    password: ['red', 'blue', 'green', 'purple'],
    maxAttempts: 4,
    colors: lengthToColors[4],
    colorMap: colorsMap,
  },
  2: {
    length: 5,
    password: ['red', 'yellow', 'blue', 'green', 'purple'],
    maxAttempts: 7,
    colors: lengthToColors[5],
    colorMap: colorsMap,
  },
  3: {
    length: 6,
    password: ['orange', 'blue', 'red', 'yellow', 'green', 'purple'],
    maxAttempts: 7,
    colors: lengthToColors[6],
    colorMap: colorsMap,
  },
  4: {
    length: 7,
    password: ['cyan', 'orange', 'purple', 'red', 'yellow', 'blue', 'green'],
    maxAttempts: 7,
    colors: lengthToColors[7],
    colorMap: colorsMap,
  },
};
