export function sortByRange(threads, compareRanges) {
  if (!compareRanges) return threads;
  return [...threads].sort((a, b) => compareRanges(a.subjectRange, b.subjectRange));
}
