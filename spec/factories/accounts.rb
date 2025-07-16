FactoryBot.define do
  factory :account, class: Pageflow::Account do
    name { 'Account Name' }

    after(:build) do |account, evaluator|
      account.default_site ||=
        build(:site, *evaluator.default_site_traits, account:, **evaluator.default_site_attributes)
    end

    trait :with_permalinks do
      default_site_traits { [:with_root_permalink_directory] }
    end

    trait(:with_first_paged_entry_template) do
      after(:create) do |account, _|
        create(:entry_template, account:, entry_type: 'paged')
      end
    end

    transient do
      with_member { nil }
      with_previewer { nil }
      with_editor { nil }
      with_publisher { nil }
      with_manager { nil }

      with_feature { nil }
      without_feature { nil }

      default_site_attributes { {} }
      default_site_traits { [] }
    end

    after(:create) do |account, evaluator|
      if evaluator.with_member
        create(:membership,
               entity: account,
               user: evaluator.with_member,
               role: :member)
      end
      if evaluator.with_previewer
        create(:membership,
               entity: account,
               user: evaluator.with_previewer,
               role: :previewer)
      end
      if evaluator.with_editor
        create(:membership,
               entity: account,
               user: evaluator.with_editor,
               role: :editor)
      end
      if evaluator.with_publisher
        create(:membership,
               entity: account,
               user: evaluator.with_publisher,
               role: :publisher)
      end
      if evaluator.with_manager
        create(:membership,
               entity: account,
               user: evaluator.with_manager,
               role: :manager)
      end
    end

    after(:build) do |entry, evaluator|
      entry.features_configuration =
        entry.features_configuration.merge(evaluator.with_feature => true,
                                           evaluator.without_feature => false)
    end
  end
end
