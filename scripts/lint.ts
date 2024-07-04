import { ESLint } from 'eslint';

export const lintFiles = async (filePaths: string) => {
  const eslint = new ESLint({ fix: true });
  const results = await eslint.lintFiles([filePaths]);
  await ESLint.outputFixes(results);
};
