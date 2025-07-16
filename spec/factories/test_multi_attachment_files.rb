module Pageflow
  FactoryBot.define do
    factory :test_multi_attachment_file, class: 'Pageflow::TestMultiAttachmentFile' do
      first_attachment { File.open(Engine.root.join('spec', 'fixtures', 'image.png')) }
      second_attachment { File.open(Engine.root.join('spec', 'fixtures', 'image.jpg')) }

      transient do
        used_in { nil }
      end

      after(:create) do |file, evaluator|
        create(:file_usage, file:, revision: evaluator.used_in) if evaluator.used_in
      end
    end
  end
end
