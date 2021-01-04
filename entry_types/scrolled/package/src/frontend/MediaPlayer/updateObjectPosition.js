export function updateObjectPosition(player, x, y) {
  player.getMediaElement().style.objectPosition =
    typeof x !== 'undefined' && typeof y !== 'undefined' ? `${x}% ${y}%` : '';
}
