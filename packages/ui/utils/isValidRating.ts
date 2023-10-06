export default function isValidRating(rating: number) {
  return rating >= 0 && rating <= 5;
}
