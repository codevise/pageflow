require 'uri'

module PageflowScrolled
  # Following the DSL for seeding the database with Pageflow
  # models, this adds a method to also seed a PageflowScrolled Entry configuration.
  # Usage: See pageflow/seeds.rb
  module Seeds
    # Create a sample scrolled {Entry} with one section, based on the PageflowNext
    # presentation example if no scrolled entry with that title exists in the given account.
    #
    # @param [Hash] attributes  attributes to override defaults
    # @option attributes [Account] :account  required
    # @option attributes [String] :title  required
    # @option attributes [Array] :chapters  required
    #   An array of chapter configurations, each containing a key "sections"
    #   which lists the separate sections of each chapter.
    #   Each section has a "foreground"-key
    #   under which an array of content_element configurations is stored.
    #   Each content_element configuration must provide a "type"-attribute
    #   to determine the React component used to render this content element.
    # @option attributes [Hash] :image_files A hash mapping image
    #   names used in properties like `backdrop.image` to urls.
    # @option attributes [Hash] :audio_files A hash mapping audio files to urls.
    # @option attributes [Hash] :video_files A hash mapping video
    #   names used in properties like `backdrop.video` to urls.
    # @option attributes [Hash] :text_track_files A hash mapping text track files to urls.
    # @yield [entry] a block to be called before the entry is saved
    # @param [Hash] options  options for entry and files creation
    # @option options [Boolean] :skip_encoding
    #   Flag indicating whether to encode video and audio files on creation or set them directly to
    #   encoded
    # @return [Entry] newly created entry
    def sample_scrolled_entry(attributes:, options: {})
      entry = Pageflow::Entry.where(type_name: 'scrolled')
                             .where(attributes.slice(:account, :title))
                             .first

      if entry.nil?
        entry = Pageflow::Entry.create!(type_name: 'scrolled',
                                        **attributes.except(:chapters,
                                                            :image_files,
                                                            :video_files,
                                                            :audio_files,
                                                            :text_track_files)) do |created_entry|
          created_entry.site = attributes.fetch(:account).default_site

          say_creating_scrolled_entry(created_entry)
          yield(created_entry) if block_given?
        end

        draft_entry = Pageflow::DraftEntry.new(entry)

        image_files_by_name = create_files(draft_entry,
                                           :image,
                                           attributes.fetch(:image_files, {}))

        video_files_by_name = create_files(draft_entry,
                                           :video,
                                           attributes.fetch(:video_files, {}),
                                           options.fetch(:skip_encoding, false))

        audio_files_by_name = create_files(draft_entry,
                                           :audio,
                                           attributes.fetch(:audio_files, {}),
                                           options.fetch(:skip_encoding, false))

        files_by_name = image_files_by_name.merge(video_files_by_name).merge(audio_files_by_name)

        # rewrite parent file references to actual ids
        text_tracks_by_name = attributes.fetch(:text_track_files, {})
        text_tracks_by_name.each do |_name, text_track_config|
          parent_file = files_by_name.fetch(text_track_config['parent_file_id'])
          text_track_config['parent_file_id'] = parent_file.id
        end
        create_files(draft_entry, :text_track, text_tracks_by_name)

        attributes[:chapters].each_with_index do |chapter_config, i|
          create_chapter(entry, chapter_config, i, files_by_name)
        end
      end

      entry
    end

    private

    def say(text)
      puts(text) unless Rails.env.test?
    end

    def say_creating_scrolled_entry(entry)
      say("   sample scrolled entry '#{entry.title}'\n")
    end

    def create_files(draft_entry, file_type, file_data_by_name, skip_encoding = false)
      file_data_by_name.transform_values do |data|
        say("     creating #{file_type} file from #{data['url']}")

        file_state = %i[image text_track].include?(file_type) ? 'processed' : 'uploading'
        file = draft_entry.create_file!(Pageflow::BuiltInFileType.send(file_type),
                                        state: file_state,
                                        attachment: URI.parse(data['url']),
                                        configuration: data['configuration'],
                                        parent_file_model_type: data['parent_file_model_type'],
                                        parent_file_id: data['parent_file_id'],
                                        **data.slice('width', 'height').symbolize_keys)
        if %i[audio video].include?(file_type)
          if skip_encoding
            file.update!(state: 'encoded')
            if file_type.eql?(:video)
              file.update!(output_presences: {
                             'dash-playlist' => true,
                             'hls-playlist' => true,
                             'dash-medium' => true,
                             'hls-medium' => true,
                             'dash-high' => true,
                             'hls-high' => true,
                             'dash-low' => true,
                             'hls-low' => true,
                             'medium' => true,
                             'high' => true,
                             'low' => true
                           })
            end
          else
            file.publish!
          end
        end

        file
      end
    end

    def create_chapter(entry, chapter_config, position, files_by_name)
      section_configs = chapter_config.delete('sections') || []
      chapter = Chapter.create!(
        storyline: Storyline.all_for_revision(entry.draft).first,
        configuration: {
          title: chapter_config['title'],
          summary: chapter_config['summary']
        },
        position:
      )

      section_configs.each_with_index do |section_config, i|
        create_section(chapter, section_config, i, files_by_name)
      end
    end

    def create_section(chapter, section_config, position, files_by_name)
      content_element_configs = section_config.delete('foreground') || []

      rewrite_file_references!(section_config['backdrop'],
                               %w[image imageMobile video],
                               files_by_name)

      section = Section.create!(chapter:,
                                configuration: section_config,
                                position:)

      content_element_configs.each_with_index do |content_element_config, i|
        create_content_element(section, content_element_config, i, files_by_name)
      end
    end

    def create_content_element(section, content_element_config, position, files_by_name)
      if %w[inlineAudio inlineBeforeAfter inlineImage inlineVideo stickyImage]
         .include?(content_element_config['type'])
        rewrite_file_references!(
          content_element_config['props'],
          %w[id before_id after_id],
          files_by_name
        )
      end

      section.content_elements.create!(
        type_name: content_element_config['type'],
        configuration: content_element_config['props'],
        position:
      )
    end

    def rewrite_file_references!(hash, keys, files_by_name)
      return unless hash

      keys.each do |key|
        next unless hash[key]
        next if non_file_reference?(hash[key])

        hash[key] = files_by_name.fetch(hash[key]).perma_id
      end
    end

    def non_file_reference?(value)
      value.starts_with?('#')
    end
  end
end
