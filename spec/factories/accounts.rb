FactoryGirl.define do
  factory :account, :class => Pageflow::Account do
    name "Account Name"

    after(:build) do |account|
      account.default_theming ||= build(:theming, :account => account)
    end
  end
end
