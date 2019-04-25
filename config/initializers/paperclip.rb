Paperclip.interpolates(:pageflow_s3_root) do |_attachment, _style|
  Pageflow.config.paperclip_s3_root
end

Paperclip.interpolates(:class_basename) do |attachment, style|
  Pageflow::PaperclipInterpolations::Support.class_basename(attachment, style)
end

Paperclip.interpolates(:attachments_path_name) do |attachment, style|
  record = attachment.instance
  return record.attachments_path_name if record.respond_to?(:attachments_path_name)
  self.attachment(attachment, style)
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
