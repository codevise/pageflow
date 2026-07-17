import {useFocusOutlineVisible} from './focusOutline';

// Whether the player controls should auto-hide because the user is
// idle and not interacting with them. Shared by the control bar and by
// chrome rendered alongside it (e.g. the fullscreen button) so they
// fade in sync.
export function usePlayerControlsInactive(playerState) {
  const focusOutlineVisible = useFocusOutlineVisible();

  return (playerState.userIdle || !playerState.userHovering) &&
         (!focusOutlineVisible || !playerState.focusInsideControls) &&
         !playerState.userHoveringControls;
}
