module Pageflow
  FactoryBot.define do
    sequence :title do |n|
      "Entry #{n}"
    end

    factory :entry, class: Entry do
      title

      account

      after(:build) do |entry|
        entry.site ||= entry.account.default_site
      end

      transient do
        with_previewer { nil }
        with_editor { nil }
        with_publisher { nil }
        with_manager { nil }

        with_feature { nil }
        without_feature { nil }

        draft_attributes { nil }

        permalink_attributes { nil }
      end

      after(:create) do |entry, evaluator|
        create(:membership,
               entity: entry,
               user: evaluator.with_previewer,
               role: :previewer) if evaluator.with_previewer
        create(:membership,
               entity: entry,
               user: evaluator.with_editor,
               role: :editor) if evaluator.with_editor
        create(:membership,
               entity: entry,
               user: evaluator.with_publisher,
               role: :publisher) if evaluator.with_publisher
        create(:membership,
               entity: entry,
               user: evaluator.with_manager,
               role: :manager) if evaluator.with_manager

        entry.draft.update!(evaluator.draft_attributes) if evaluator.draft_attributes
      end

      after(:build) do |entry, evaluator|
        entry.features_configuration =
          entry.features_configuration.merge(evaluator.with_feature => true,
                                             evaluator.without_feature => false)

        if evaluator.permalink_attributes
          permalink_directory =
            evaluator.permalink_attributes[:directory] ||
            build(
              :permalink_directory,
              site: entry.site,
              path: evaluator.permalink_attributes.fetch(:directory_path, '')
            )

          entry.build_permalink(
            allow_root_path: evaluator.permalink_attributes[:allow_root_path],
            directory: permalink_directory,
            slug: evaluator.permalink_attributes.fetch(:slug)
          )
        end
      end

      trait :published do
        first_published_at { 1.month.ago }

        transient do
          published_revision_attributes { {} }
        end

        after(:create) do |entry, evaluator|
          create(:revision, :published,
                 evaluator.published_revision_attributes.merge(entry: entry))
        end
      end

      trait :published_with_password do
        first_published_at { 1.month.ago }

        transient do
          published_revision_attributes { {} }
        end

        after(:create) do |entry, evaluator|
          create(:revision,
                 :published,
                 evaluator.published_revision_attributes.merge(
                   entry: entry,
                   password_protected: true
                 ))
        end
      end

      trait :published_with_noindex do
        first_published_at { 1.month.ago }

        transient do
          published_revision_attributes { {} }
        end

        after(:create) do |entry, evaluator|
          create(:revision,
                 :published,
                 evaluator.published_revision_attributes.merge(
                   entry: entry,
                   noindex: true
                 ))
        end
      end

      trait :with_highdef_video_encoding do
        feature_states { {'highdef_video_encoding' => true} }
      end
    end
  end
end
