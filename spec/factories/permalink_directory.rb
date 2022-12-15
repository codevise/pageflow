FactoryBot.define do
  factory :permalink_directory, class: Pageflow::PermalinkDirectory do
    site
    path { '' }
  end
end
