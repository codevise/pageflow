module Pageflow
  FactoryBot.define do
    factory :hosted_file, class: 'Pageflow::TestHostedFile' do
      attachment { File.open(Engine.root.join('spec', 'fixtures', 'image.png')) }
      state { 'uploaded' }

      transient do
        used_in { nil }
      end

      after(:create) do |file, evaluator|
        create(:file_usage, file: file, revision: evaluator.used_in) if evaluator.used_in
      end

      trait :uploading do
        attachment { nil }
        attachment_on_s3_file_name { 'image.jpg' }
        state { 'uploading' }

        after :create do |hosted_file|
          FileUtils.mkdir_p(File.dirname(hosted_file.attachment.path))
          attachment_path = Engine.root.join('spec', 'fixtures', hosted_file.attachment_on_s3_file_name)
          unless File.identical?(attachment_path, hosted_file.attachment.path)
            FileUtils.cp(attachment_path, hosted_file.attachment.path)
          end
        end
      end

      trait :uploaded do
      end

      trait :uploading_failed do
        state { 'uploading_failed' }
      end
    end
  end
end
