module Pageflow
  FactoryBot.define do
    factory :entry_template, class: Pageflow::EntryTemplate do
      account
      theme_name { 'default' }
    end
  end
end
