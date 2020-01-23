
export function firstLetterUpperCase (str: string): string {
  const resettedString = str.toLowerCase();
  return `${resettedString.substr(0, 1).toUpperCase()}${resettedString.substr(1)}`;
}
