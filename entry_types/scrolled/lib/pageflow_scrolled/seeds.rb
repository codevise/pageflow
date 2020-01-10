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
    # @yield [entry] a block to be called before the entry is saved
    # @return [Entry] newly created entry
    def sample_scrolled_entry(attributes)
      entry = Pageflow::Entry.where(type_name: 'scrolled')
                             .where(attributes.slice(:account, :title))
                             .first

      if entry.nil?
        entry = Pageflow::Entry.create!(type_name: 'scrolled',
                                        **attributes.except(:chapters)) do |created_entry|
          created_entry.theming = attributes.fetch(:account).default_theming

          say_creating_scrolled_entry(created_entry)
          yield(created_entry) if block_given?
        end

        attributes[:chapters].each_with_index do |chapter_config, i|
          create_chapter(entry, chapter_config, i)
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

    def create_chapter(entry, chapter_config, position)
      sections_config = chapter_config.extract!('sections')
      chapter = Chapter.create!(
        revision: entry.draft,
        configuration: {
          title: chapter_config['title'],
          summary: chapter_config['summary']
        },
        position: position
      )
      return unless sections_config.present?
      sections_config['sections'].each_with_index do |section_config, i|
        create_section(chapter, section_config, i)
      end
    end

    def create_section(chapter, section_config, position)
      content_elements_config = section_config.extract!('foreground')
      section = Section.create!(chapter: chapter,
                                configuration: section_config,
                                position: position)
      return unless content_elements_config.present?
      content_elements_config['foreground'].each_with_index do |content_element_config, i|
        create_content_element(section, content_element_config, i)
      end
    end

    def create_content_element(section, content_element_config, position)
      section.content_elements.create!(
        type_name: content_element_config['type'],
        configuration: content_element_config['props'],
        position: position
      )
    end
  end
end
