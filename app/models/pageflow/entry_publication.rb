module Pageflow
  class EntryPublication
    attr_reader :entry, :attributes, :quota, :user

    def initialize(entry, attributes, published_entries_quota, user)
      @entry = entry
      @attributes = attributes
      @quota = published_entries_quota
      @user = user
    end

    def exceeding?
      assumed_quota.exceeded?
    end

    def save!
      assumed_quota.verify_not_exceeded!
      entry.publish(attributes.merge(creator: user))

      Pageflow.config.hooks.invoke(:entry_published, entry:)
    end

    private

    def assumed_quota
      quota.assume(published_entry: entry)
    end
  end
end
