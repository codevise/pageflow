module Pageflow
  FactoryBot.define do
    factory :draft_entry, class: DraftEntry do
      transient do
        title
        account
        theming
        type_name { 'paged' }
        revision_attributes { {} }

        with_feature { nil }
        without_feature { nil }
      end

      initialize_with do
        DraftEntry.new(create(:entry,
                              title: title,
                              account: account,
                              theming: theming,
                              type_name: type_name,
                              draft_attributes: revision_attributes,
                              with_feature: with_feature,
                              without_feature: without_feature))
      end

      to_create { |draft_entry| draft_entry.entry.save! }
    end
  end
end
