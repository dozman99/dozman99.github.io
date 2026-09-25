const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]

/** Small counts as a capitalized word ("Six"); larger ones stay numeric. */
export function countWord(n: number): string {
  const w = WORDS[n]
  return w ? w.charAt(0).toUpperCase() + w.slice(1) : String(n)
}
