Paperclip.interpolates(:pageflow_filesystem_root) do |_attachment, _style|
  Pageflow.config.paperclip_filesystem_root
end

Paperclip.interpolates(:pageflow_s3_root) do |_attachment, _style|
  Pageflow.config.paperclip_s3_root
end

Paperclip.interpolates(:class_basename) do |attachment, style|
  Pageflow::PaperclipInterpolations::Support.class_basename(attachment, style)
end

Paperclip.interpolates(:pageflow_placeholder) do |attachment, style|
  Pageflow::PaperclipInterpolations::Support.pageflow_placeholder(attachment, style)
end

Paperclip.interpolates(:pageflow_attachments_version) do |attachment, style|
  Pageflow::PaperclipInterpolations::Support.pageflow_attachments_version(attachment, style)
end

Paperclip.configure do |config|
  config.register_processor(:pageflow_vtt, Pageflow::PaperclipProcessors::Vtt)
end

Paperclip::UriAdapter.register
