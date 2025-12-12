/**
 * Converts raw question text to LaTeX format
 * This is a simple string replacement for the specific question
 * In production, you'd use a more sophisticated parser
 */
export function convertToLatex(rawText: string): string {
  let latex = rawText;

  // Convert specific patterns for this question
  latex = latex.replace(/0\.00000000031/g, "0.00000000031");

  // Convert 'plus-minus a times 10 to the power of n' to LaTeX
  latex = latex.replace(
    /'plus-minus a times 10 to the power of n'/g,
    "$\\pm a \\times 10^{n}$"
  );

  // Convert comparison expressions
  latex = latex.replace(
    /1 is less than or equal to a which is less than 10/g,
    "$1 \\leq a < 10$"
  );

  // Convert 'n is an integer'
  latex = latex.replace(/n is an integer/g, "$n$ is an integer");

  return latex;
}

/**
 * Alternative: Manual LaTeX string for better control
 * Use this if you want perfect rendering
 */
export function getFormattedQuestion(): string {
  return `Convert the number $0.00000000031$ to the form $\\pm a \\times 10^{n}$, where $1 \\leq a < 10$, and $n$ is an integer.`;
}
