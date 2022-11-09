FactoryBot.define do
  factory :permalink_directory, class: Pageflow::PermalinkDirectory do
    theming
    path { '' }
  end
end
