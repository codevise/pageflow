module Pageflow
  FactoryBot.define do
    factory :edit_lock, :class => EditLock do
      user nil
      entry { build(:entry) }
      updated_at { Time.now }
    end
  end
end
