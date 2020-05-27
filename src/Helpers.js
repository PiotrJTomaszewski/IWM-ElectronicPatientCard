export default function capitalizeFirstLetter(text) {
  if (text === undefined) return text;
  return text.substr(0, 1).toUpperCase() + text.substr(1);
}

export function helperGetPeriod(
  period,
  asString = false,
  ifNotFound = undefined
) {
  if (period) {
    if (asString) {
      if (period.start && period.end) {
        return `From ${period.start} to ${period.end}`;
      }
      if (period.start) {
        return `From ${period.start}`;
      }
      if (period.end) {
        return `To ${period.end}`;
      }
      return ifNotFound;
    } else {
      return [period.start, period.end];
    }
  }
  return ifNotFound;
}

