module PageflowScrolled
  # Render entries and chapters that links point to.
  #
  # @api private
  module LinkedEntriesHelper
    include Pageflow::SocialShareHelper

    def scrolled_linked_entries_json_seed(json, scrolled_entry, configurables)
      json.linked_entries(scrolled_linked_entries(scrolled_entry, configurables)) do |linked_entry|
        json.partial!(scrolled_linked_entry_partial(scrolled_entry), linked_entry:)
      end
    end

    private

    def scrolled_linked_entries(scrolled_entry, configurables)
      LinkedEntry.all(
        scrolled_entry.account.entries.preload(:site, :account, permalink: :directory),
        EntryLinkReferences.new(configurables.map(&:configuration)).chapter_perma_ids_by_entry_id
      )
    end

    def scrolled_linked_entry_partial(scrolled_entry)
      if scrolled_entry.published_revision?
        'pageflow_scrolled/linked_entries/linked_entry'
      else
        'pageflow_scrolled/linked_entries/preview_linked_entry'
      end
    end
  end
end
