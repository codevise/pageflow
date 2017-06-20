export default function InfoBox(props) {
  return (
    <div className="waveform_player_controls-info_box">
      <h3 className="waveform_player_controls-info_box-title">{props.title}</h3>
      <p className="waveform_player_controls-info_box-description"
         dangerouslySetInnerHTML={{__html: props.description}} />
    </div>
  );
}
