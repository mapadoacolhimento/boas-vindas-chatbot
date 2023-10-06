export default function getNumberFromString(msg: string) {
  const regex = /\d+/;
  const match = msg.match(regex);
  const rating = match && match.length > 0 ? Number(match[0]) : null;

  return Number.isNaN(rating) ? null : rating;
}
