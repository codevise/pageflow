module Pageflow
  FactoryBot.define do
    factory :published_entry, class: PublishedEntry do
      transient do
        title
        account
        theming
        type_name { 'paged' }
        revision_attributes { {} }
        permalink_attributes { nil }

        with_feature { nil }
        without_feature { nil }
      end

      initialize_with do
        PublishedEntry.new(create(:entry,
                                  :published,
                                  title: title,
                                  account: account,
                                  theming: theming,
                                  type_name: type_name,
                                  published_revision_attributes: revision_attributes,
                                  permalink_attributes: permalink_attributes,
                                  with_feature: with_feature,
                                  without_feature: without_feature))
      end

      to_create { |published_entry| published_entry.entry.save! }
    end
  end
end
