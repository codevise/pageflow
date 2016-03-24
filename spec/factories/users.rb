module Pageflow
  FactoryGirl.define do
    sequence :email do |n|
      "person#{n}@example.com"
    end

    factory :user do
      transient do
        on nil
      end

      email
      first_name 'John'
      last_name 'Doe'

      password '@qwert12345'
      password_confirmation { password }

      account

      trait :editor do
          after(:create) do |user, evaluator|
            create(:membership, user: user, entity: evaluator.on, role: 'editor') if evaluator.on
          end
      end

      trait :account_manager do
        role 'account_manager'
        after(:create) do |user|
          create(:membership, user: user, entity: user.account, role: 'manager')
        end
      end

      trait :previewer do
        after(:create) do |user, evaluator|
          create(:membership, user: user, entity: evaluator.on, role: 'previewer')
        end
      end

      trait :publisher do
        after(:create) do |user, evaluator|
          create(:membership, user: user, entity: evaluator.on, role: 'publisher')
        end
      end

      trait :manager do
        after(:create) do |user, evaluator|
          create(:membership, user: user, entity: evaluator.on, role: 'manager')
        end
      end

      trait :admin do
        role 'admin'
      end

      trait :suspended do
        suspended_at { 1.hour.ago }
      end
    end

    factory :valid_user, :class => User do
      email
      first_name "Edison"
      last_name "Editor"
    end
  end
end
