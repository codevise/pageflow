module Pageflow
  FactoryBot.define do
    factory :draft_entry, class: DraftEntry do
      initialize_with do
        DraftEntry.new(create(:entry))
      end

      to_create { |draft_entry| draft_entry.entry.save! }
    end
  end
end
