module Pageflow
  module AudioFilesHelper
    def audio_file_audio_tag(audio_file_id, options = {})
      options.merge!(class: ['audio-js', options.delete(:class)].compact * ' ',
                     controls: true,
                     preload: 'none')
      url_options = {unique_id: options.delete(:unique_id)}

      if (audio_file = AudioFile.find_by_id(audio_file_id))
        content_tag(:audio, options) do
          audio_file_sources(audio_file, url_options).each do |source|
            concat(tag(:source, source.slice(:src, :type)))
          end
        end
      end
    end

    def audio_file_script_tag(audio_file_id, options = {})
      if (audio_file = AudioFile.find_by_id(audio_file_id))
        render('pageflow/audio_files/script_tag',
               audio_file: audio_file,
               audio_file_sources: audio_file_sources(audio_file, options))
      end
    end

    def audio_file_non_js_link(entry, audio_file_id)
      if (audio_file = AudioFile.find_by_id(audio_file_id))
        link_to(t('pageflow.audio.open'), short_audio_file_path(entry, audio_file))
      end
    end

    def audio_file_sources(audio_file, options = {})
      [
        {type: 'audio/ogg', src: audio_file.ogg.url(options)},
        {type: 'audio/mp4', src: audio_file.m4a.url(options)},
        {type: 'audio/mpeg', src: audio_file.mp3.url(options)}
      ]
    end
  end
end
