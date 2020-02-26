module Pageflow
  FactoryBot.define do
    factory :published_entry, class: PublishedEntry do
      transient do
        type_name { 'paged' }
        revision_attributes { {} }
      end

      initialize_with do
        PublishedEntry.new(create(:entry,
                                  :published,
                                  type_name: type_name,
                                  published_revision_attributes: revision_attributes))
      end

      to_create { |published_entry| published_entry.entry.save! }
    end
  end
end
