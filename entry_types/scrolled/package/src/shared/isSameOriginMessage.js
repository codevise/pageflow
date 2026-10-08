export function isSameOriginMessage(message) {
  return message.origin === window.location.origin;
}
