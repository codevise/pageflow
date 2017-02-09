export default function(props) {
  return (
    <div className="close_button text_hidden_only"
         tabIndex="4"
         title={I18n.t('pageflow.public.close')}
         onClick={props.onClick}>

      <div className="label">
        {I18n.t('pageflow.public.close')}
      </div>
    </div>
  );
}
