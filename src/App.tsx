import React from 'react';

import { useGameInit } from './hooks/useGameInit';
import ColorPalette from './components/ColorPalette';
import AttemptsContainer from './components/AttempsContainer';

const App = () => {
  const { state, currentLevel, pickColor, reset, nextLevel } = useGameInit();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">计客超级密码机</h1>
          <div className="text-sm">
            关卡{' '}
            <span className="font-mono px-2 py-1 bg-gray-100 rounded">
              {state.level}
            </span>
          </div>
        </header>

        <section className="mb-4">
          <div className="mb-2 text-sm text-gray-600">困难模式（固定开启）</div>
          <ColorPalette
            colors={currentLevel.colors}
            disabled={state.over || state.success}
            onClick={(hex, key) => pickColor(key, hex)}
          />
        </section>

        <section className="mb-4">
          <AttemptsContainer
            attempts={state.attempts}
            currentAttempt={state.currentAttempt}
            currentSlotIndex={state.currentSlotIndex}
            maxAttempts={state.maxAttempts}
            levelLength={currentLevel.length}
            success={state.success}
            over={state.over}
          />
        </section>

        <section className="flex items-center gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            重置关卡
          </button>

          {state.success && (
            <div className="text-green-600 font-semibold">
              恭喜！你成功破解了密码！
            </div>
          )}

          {state.over && (
            <div className="text-red-600 font-semibold">
              挑战失败，机会用完。
            </div>
          )}

          <div className="ml-auto">
            <button
              onClick={nextLevel}
              disabled={!state.success}
              className="px-3 py-1 bg-indigo-600 text-white rounded disabled:opacity-50"
            >
              下一关
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
