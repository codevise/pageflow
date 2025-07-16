module Pageflow
  FactoryBot.define do
    factory :draft_entry, class: DraftEntry do
      transient do
        title
        account
        site
        type_name { 'paged' }
        revision_attributes { {} }

        with_feature { nil }
        without_feature { nil }

        translation_of { nil }
      end

      initialize_with do
        DraftEntry.new(create(:entry,
                              title:,
                              account:,
                              site:,
                              type_name:,
                              draft_attributes: revision_attributes,
                              with_feature:,
                              without_feature:))
      end

      to_create { |draft_entry| draft_entry.entry.save! }

      after(:create) do |published_entry, evaluator|
        if evaluator.translation_of
          published_entry.entry.mark_as_translation_of(evaluator.translation_of.to_model)
        end
      end
    end
  end
end
