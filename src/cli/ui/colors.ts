const ESC = '\x1b';
const c = (code: number) => (s: string) => `${ESC}[${code}m${s}${ESC}[0m`;

export const colors = {
  green: c(32),
  yellow: c(33),
  cyan: c(36),
  gray: c(90),
  bold: c(1),
  red: c(31),
};

export const formatHeading = (s: string): string => colors.bold(colors.cyan(s));
export const formatSuccess = (s: string): string => colors.green(s);
export const formatWarn = (s: string): string => colors.yellow(s);
export const formatError = (s: string): string => colors.red(s);
export const formatDim = (s: string): string => colors.gray(s);
