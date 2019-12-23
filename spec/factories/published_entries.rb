module Pageflow
  FactoryBot.define do
    factory :published_entry, class: PublishedEntry do
      initialize_with do
        PublishedEntry.new(create(:entry, :published))
      end

      to_create { |published_entry| published_entry.entry.save! }
    end
  end
end
