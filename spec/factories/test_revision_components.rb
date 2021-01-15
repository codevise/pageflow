module Pageflow
  FactoryBot.define do
    factory :test_revision_component, class: 'Pageflow::TestRevisionComponent' do
      text { 'Some text' }
    end

    factory :test_composite_revision_component, class: 'Pageflow::TestCompositeRevisionComponent' do
      text { 'Some text' }
    end
  end
end
