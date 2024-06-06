module Pageflow
  FactoryBot.define do
    factory :published_entry, class: PublishedEntry do
      transient do
        title
        account
        site
        type_name { 'paged' }
        revision_attributes { {} }
        permalink_attributes { nil }

        with_feature { nil }
        without_feature { nil }

        translation_of { nil }

        entry_trait { :published }
      end

      trait :published_with_password do
        entry_trait { :published_with_password }
      end

      trait :published_with_noindex do
        entry_trait { :published_with_noindex }
      end

      initialize_with do
        PublishedEntry.new(create(:entry,
                                  entry_trait,
                                  title:,
                                  account:,
                                  site:,
                                  type_name:,
                                  published_revision_attributes: revision_attributes,
                                  permalink_attributes:,
                                  with_feature:,
                                  without_feature:))
      end

      to_create { |published_entry| published_entry.entry.save! }

      after(:create) do |published_entry, evaluator|
        if evaluator.translation_of
          published_entry.entry.mark_as_translation_of(evaluator.translation_of.to_model)
        end
      end
    end
  end
end
