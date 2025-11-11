import React from 'react';

type Attempt = {
  attempt: string[];
  feedback: { correctPositions: number; correctColors: number };
};

type Props = {
  attempts: Attempt[];
  currentAttempt: Array<string | null>;
  currentSlotIndex: number;
  maxAttempts: number;
  levelLength: number;
  success: boolean;
  over: boolean;
};

export default function AttemptsContainer({
  attempts,
  currentAttempt,
  currentSlotIndex,
  maxAttempts,
  levelLength,
  success,
  over,
}: Props) {
  // 已填充行
  return (
    <div className="space-y-2">
      {attempts.map((row, idx) => (
        <div key={idx} className="flex items-center gap-4">
          <div className="flex gap-2">
            {row.attempt.map((c, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-md border"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="flex gap-1">
            {Array.from({ length: row.feedback.correctPositions }).map(
              (_, i) => (
                <div
                  key={`g-${i}`}
                  className="w-3 h-3 rounded-full bg-green-500"
                />
              )
            )}
            {Array.from({ length: row.feedback.correctColors }).map((_, i) => (
              <div key={`b-${i}`} className="w-3 h-3 rounded-full bg-sky-300" />
            ))}
            {Array.from({
              length:
                levelLength -
                (row.feedback.correctPositions + row.feedback.correctColors),
            }).map((_, i) => (
              <div
                key={`e-${i}`}
                className="w-3 h-3 rounded-full bg-gray-200"
              />
            ))}
          </div>
        </div>
      ))}

      {/* 当前行 */}
      {!success && !over && (
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {currentAttempt.map((c, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-md border flex items-center justify-center ${
                  i === currentSlotIndex ? 'ring-2 ring-indigo-200' : ''
                }`}
                style={{ backgroundColor: c || '#ecf0f1' }}
              >
                {!c ? i + 1 : null}
              </div>
            ))}
          </div>
          <div className="flex gap-1">
            {Array.from({ length: levelLength }).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-gray-200" />
            ))}
          </div>
        </div>
      )}

      {/* 剩余空行 */}
      {Array.from({
        length: Math.max(
          0,
          maxAttempts - attempts.length - (success || over ? 0 : 1)
        ),
      }).map((_, i) => (
        <div key={`empty-${i}`} className="flex items-center gap-4 opacity-50">
          <div className="flex gap-2">
            {Array.from({ length: levelLength }).map((_, j) => (
              <div key={j} className="w-8 h-8 rounded-md bg-gray-50 border" />
            ))}
          </div>
          <div className="flex gap-1">
            {Array.from({ length: levelLength }).map((_, k) => (
              <div key={k} className="w-3 h-3 rounded-full bg-gray-100" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
