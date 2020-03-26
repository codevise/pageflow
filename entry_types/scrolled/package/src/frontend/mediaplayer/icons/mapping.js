import icons from '../icons';

/**
 * Register {@link pageflow.react.components.SvgIcon} components to be used by other
 * components.
 *
 * @example
 *
 * const {SvgIcon} = pageflow.react;
 *
 * pageflow.react.iconMapping['pageflow-rainbow.checkmark'] = function(props) {
 *   return (
 *     <SvgIcon {...props} viewBoxWidth={512} viewBoxHeight={512}>
 *       <polygon points="434.442,58.997 195.559,297.881 77.554,179.88 0,257.438 195.559,453.003 512,136.551 " />
 *     </SvgIcon>
 *   );
 * };
 *
 * @alias pageflow.react.iconMapping
 */
export default {
  toggleInfoBox: icons.Info,
  mediaQuality: icons.Gear,
  textTracks: icons.Subtitles,
  activeMenuItem: icons.Checkmark,
  loadingSpinner: icons.CircleWithNotch,
  play: icons.Play,
  pause: icons.Pause,
};
