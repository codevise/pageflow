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
    # @option attributes [Array] :sections  required
    #   An array of section configurations, each containing a key "foreground"
    #   under which an array of content_element configurations is stored.
    #   Each content_element configuration must provide a "type" and "props".
    # @yield [entry] a block to be called before the entry is saved
    # @return [Entry] newly created entry
    def sample_scrolled_entry(attributes)
      entry = Pageflow::Entry.where(type_name: 'scrolled')
                             .where(attributes.slice(:account, :title))
                             .first

      if entry.nil?
        entry = Pageflow::Entry.create!(type_name: 'scrolled',
                                        **attributes.except(:sections)) do |created_entry|
          created_entry.theming = attributes.fetch(:account).default_theming

          say_creating_scrolled_entry(created_entry)
          yield(created_entry) if block_given?
        end

        chapter = nil
        attributes[:sections].each_with_index do |section_config, i|
          # A section where the first content element defines an "anchor" opens a new chapter.
          chapter_title = section_config['foreground'].first&.dig('props', 'anchor')
          if chapter_title
            chapter = Chapter.create!(revision: entry.draft, configuration: {title: chapter_title})
          end
          create_section(chapter, section_config, i)
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

    def create_section(chapter, section_config, position)
      content_elements_config = section_config.extract!('foreground')
      section = Section.create!(chapter: chapter,
                                position: position,
                                configuration: section_config)
      content_elements_config['foreground'].each_with_index do |content_element_config, i|
        create_content_element(section, content_element_config, i)
      end
    end

    def create_content_element(section, content_element_config, position)
      section.content_elements.create!(
        type_name: content_element_config['type'],
        configuration: content_element_config['props'].except('anchor'),
        position: position
      )
    end
  end
end
