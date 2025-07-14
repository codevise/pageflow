require 'pageflow/paperclip_processors/vtt'
require 'pageflow/paperclip_processors/audio_waveform'
require 'pageflow/paperclip_processors/webp'
require 'pageflow/paperclip_processors/noop'

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

Paperclip.interpolates(:pageflow_hls_qualities) do |attachment, _style|
  # Placeholder :pageflow_hls_qualities is included here to let
  # VideoFileUrlTemplates preserve the palceholder in url templates.
  %w[:pageflow_hls_qualities low medium high fullhd 4k].select { |quality|
    attachment.instance.output_presences[quality]
  }.join(',')
end

Paperclip.configure do |config|
  config.register_processor(:pageflow_webp,
                            Pageflow::PaperclipProcessors::Webp)

  config.register_processor(:pageflow_vtt,
                            Pageflow::PaperclipProcessors::Vtt)

  config.register_processor(:pageflow_audio_waveform,
                            Pageflow::PaperclipProcessors::AudioWaveform)

  config.register_processor(:noop,
                            Pageflow::PaperclipProcessors::Noop)
end

Paperclip::UriAdapter.register
