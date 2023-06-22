export function capitalizeFirstLetter(string: string): string {
  return string?.charAt(0).toUpperCase() + string?.slice(1);
}

export function convertAPIkeyToReadable(statName: string): string {
  return statName
    ?.split("-")
    .map((word) => capitalizeFirstLetter(word))
    .join(" ");
}
