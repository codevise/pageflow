module PageflowScrolled
  FactoryBot.define do
    factory :scrolled_revision,
            class: PageflowScrolled::Revision,
            parent: :revision
  end
end
