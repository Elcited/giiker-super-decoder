export function calculateFeedback(
  attempt: Array<string | null>,
  password: string[]
) {
  const passCopy = [...password];
  const attCopy = [...attempt];

  let correctPositions = 0;
  let correctColors = 0;

  for (let i = 0; i < password.length; i++) {
    if (attCopy[i] && attCopy[i] === password[i]) {
      correctPositions++;
      passCopy[i] = '';
      attCopy[i] = null;
    }
  }

  for (let i = 0; i < attCopy.length; i++) {
    const c = attCopy[i];
    if (c) {
      const idx = passCopy.indexOf(c);
      if (idx !== -1) {
        correctColors++;
        passCopy[idx] = '';
      }
    }
  }

  return { correctPositions, correctColors };
}
