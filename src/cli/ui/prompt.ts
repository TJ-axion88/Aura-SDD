import readline from 'readline';

export const isInteractive = (): boolean =>
  process.stdin.isTTY === true && process.stdout.isTTY === true;

export const askYesNo = async (question: string): Promise<boolean> => {
  if (!isInteractive()) return false;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(`${question} [y/N] `, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'y');
    });
  });
};

export const askChoice = async (
  question: string,
  choices: string[],
): Promise<string> => {
  if (!isInteractive()) return choices[0] ?? '';
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const opts = choices.map((c, i) => `  ${i + 1}) ${c}`).join('\n');
  return new Promise((resolve) => {
    process.stdout.write(`${question}\n${opts}\nChoice: `);
    rl.once('line', (line) => {
      rl.close();
      const idx = parseInt(line.trim(), 10) - 1;
      resolve(choices[Math.max(0, Math.min(idx, choices.length - 1))] ?? choices[0] ?? '');
    });
  });
};
