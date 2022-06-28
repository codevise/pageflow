json.exceeding(@encoding_confirmation.exceeding?)

json.intro_html(
  render_html_partial(
    'pageflow/editor/encoding_confirmations/intro',
    encoding_confirmation: @encoding_confirmation
  )
)

json.summary_html(
  render_html_partial(
    'pageflow/editor/encoding_confirmations/summary',
    encoding_confirmation: @encoding_confirmation
  )
)
