export default function isIntersectingX(rectA, rectB) {
  return (rectA.left < rectB.right && rectA.right > rectB.left) ||
         (rectB.left < rectA.right && rectB.right > rectA.left);
}
