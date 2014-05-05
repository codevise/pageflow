module Pageflow
  FactoryGirl.define do
    sequence :email do |n|
      "person#{n}@example.com"
    end

    factory :user do
      email
      first_name 'John'
      last_name 'Doe'

      password '@qwert12345'
      password_confirmation { password }

      account

      trait :editor do
      end

      trait :account_manager do
        role 'account_manager'
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
