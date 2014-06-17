FactoryGirl.define do
  factory :account, :class => Pageflow::Account do
    name "Account Name"
    default_theming :factory => :theming
  end
end
