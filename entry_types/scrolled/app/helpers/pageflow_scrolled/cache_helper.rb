module PageflowScrolled
  # @api private
  module CacheHelper
    def cache_scrolled_entry(entry:, entry_mode:, &)
      condition =
        entry_mode == :published &&
        entry.feature_state('scrolled_entry_fragment_caching')
      cache_if(condition, [entry, :head_and_body, entry_mode], &)
    end
  end
end
