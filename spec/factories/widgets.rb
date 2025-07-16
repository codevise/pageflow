FactoryBot.define do
  factory :widget, class: Pageflow::Widget do
    role { 'navigation' }
    type_name { 'test_widget' }
  end
end
