FactoryGirl.define do
  factory :account, :class => Pageflow::Account do
    name "Account Name"
    default_theme :factory => :theme
  end
end
