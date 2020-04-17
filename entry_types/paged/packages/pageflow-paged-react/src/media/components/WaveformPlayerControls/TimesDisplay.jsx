import TimeDisplay from 'components/PlayerControls/TimeDisplay';

export default function TimesDisplay(props) {
  return (
    <div className="waveform_player_controls-times_display">
      <TimeDisplay value={props.currentTime} className="waveform_player_controls-times_display-current_time" />
      /
      <TimeDisplay value={props.duration} className="waveform_player_controls-times_display-duration"/>
    </div>
  );
}
