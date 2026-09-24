module PageflowScrolled
  # @api private
  class FragmentLibrary
    attr_reader :entry, :account

    delegate :id, to: :entry

    def self.all
      Query.new(Pageflow::Entry.where(fragment_library: 'shared'))
    end

    def self.where(...)
      all.where(...)
    end

    def self.shared_for_account(account)
      entry = Pageflow::Entry
              .where(account:, type_name: 'scrolled', fragment_library: 'shared')
              .order(:id)
              .first

      new(entry && Pageflow::DraftEntry.new(entry), account:)
    end

    def initialize(entry, account: entry.account)
      @entry = entry
      @account = account
    end

    def persisted?
      entry.present?
    end

    def title
      entry.entry_title
    end

    def storylines
      Storyline.all_for_revision(entry.draft)
    end

    def chapters
      Chapter.all_for_revision(entry.draft)
    end

    def sections
      Section.all_for_revision(entry.draft)
    end

    def content_elements
      ContentElement.all_for_revision(entry.draft)
    end

    def copy_fragment_to(fragment_perma_id:, entry:, chapter:)
      SectionsCopy
        .new(source_entry: self.entry, destination_entry: entry)
        .perform(chapters.find_by!(perma_id: fragment_perma_id).sections, chapter:)
    end

    def extract_fragment_from(entry:, chapter:)
      ActiveRecord::Base.transaction do
        @entry ||= create_entry(locale: entry.locale)

        SectionsCopy
          .new(source_entry: entry, destination_entry: self.entry)
          .perform(chapter.sections, chapter: create_fragment_chapter(chapter))
      end
    end

    private

    def create_entry(locale:)
      Pageflow::DraftEntry.new(
        Pageflow::Entry.create!(
          account:,
          site: account.default_site,
          type_name: 'scrolled',
          fragment_library: 'shared',
          title: I18n.t('pageflow_scrolled.fragment_library.title',
                        account_name: account.name,
                        locale: locale == 'de' ? :de : :en)
        )
      )
    end

    def create_fragment_chapter(chapter)
      storyline = storylines.detect { |candidate| candidate.configuration['main'] }

      storyline.chapters.create!(position: (storyline.chapters.maximum(:position) || -1) + 1,
                                 configuration: chapter.configuration)
    end

    # @api private
    class Query
      include Enumerable

      def initialize(entries)
        @entries = entries
      end

      def model
        FragmentLibrary
      end

      def all
        self
      end

      def none
        Query.new(@entries.none)
      end

      def where(...)
        Query.new(@entries.where(...))
      end

      def merge(entries)
        Query.new(@entries.merge(entries))
      end

      def find(id)
        library(@entries.find(id))
      end

      def each(&)
        @entries.order(:id).map { |entry| library(entry) }.each(&)
      end

      private

      def library(entry)
        FragmentLibrary.new(Pageflow::DraftEntry.new(entry))
      end
    end
  end
end
