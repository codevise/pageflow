module Pageflow
  FactoryBot.define do
    factory :image_file, :class => ImageFile do
      entry
      uploader { create(:user) }

      attachment { File.open(Engine.root.join('spec', 'fixtures', 'image.jpg')) }
      state { 'processed' }

      transient do
        used_in { nil }
      end

      before(:create) do |file, evaluator|
        file.entry = evaluator.used_in.entry if evaluator.used_in
      end

      after(:create) do |file, evaluator|
        create(:file_usage, :file => file, :revision => evaluator.used_in) if evaluator.used_in
      end

      trait :uploading do
        attachment { nil }
        attachment_on_s3_file_name { 'image.jpg' }
        state { 'uploading' }

        # simulate direct upload in background
        # Caveat: attachment_on_s3_file_name must map to a file in fixtures
        after :create do |image_file|
          FileUtils.mkdir_p(File.dirname(image_file.attachment.path))
          attachment_path = Engine.root.join('spec', 'fixtures', image_file.attachment_on_s3_file_name)
          unless File.identical?(attachment_path, image_file.attachment.path)
            FileUtils.cp(attachment_path, image_file.attachment.path)
          end
        end
      end

      trait :uploaded do
        uploading
        state { 'uploaded' }
      end

      trait :processing do
        state { 'processing' }
      end

      trait :processed do
      end

      trait :processing_failed do
        state { 'processing_failed' }
      end
    end
  end
end
