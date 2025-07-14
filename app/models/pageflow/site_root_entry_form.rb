module Pageflow
  # @api private
  class SiteRootEntryForm
    include ActiveModel::Model

    attr_accessor :entry_id

    validates :entry, presence: true

    def initialize(attributes, site)
      super(attributes)
      @site = site
    end

    def save
      return false unless valid?

      entry.permalink.update(allow_root_path: true,
                             directory: @site.permalink_directories.find_by_path(''),
                             slug: '')
    end

    def entry
      @entry ||= @site.entries.find_by_id(entry_id)
    end
  end
end
