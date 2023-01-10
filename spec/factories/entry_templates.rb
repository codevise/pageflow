module Pageflow
  FactoryBot.define do
    factory :entry_template, class: Pageflow::EntryTemplate do
      site
      entry_type_name { 'paged' }
      theme_name { 'default' }
    end
  end
end
