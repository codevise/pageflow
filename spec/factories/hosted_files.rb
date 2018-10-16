module Pageflow
  class TestHostedFile < ActiveRecord::Base
    self.table_name = 'test_hosted_files'
    include HostedFile
  end

  FactoryBot.define do
    factory :hosted_file, class: TestHostedFile do
      trait :on_filesystem do
        attachment_on_filesystem { File.open(Engine.root.join('spec', 'fixtures', 'image.png')) }
        attachment_on_s3 { nil }
        state { 'not_uploaded_to_s3' }
      end

      trait :uploading_to_s3_failed do
        attachment_on_filesystem { File.open(Engine.root.join('spec', 'fixtures', 'image.png')) }
        attachment_on_s3 { nil }
        state { 'uploading_to_s3_failed' }
      end

      trait :uploaded_to_s3 do
        attachment_on_s3 { File.open(Engine.root.join('spec', 'fixtures', 'image.png')) }
        state { 'uploaded_to_s3' }
      end

      trait :with_overridden_keep_on_filesystem do
        after(:build) do |hosted_file|
          def hosted_file.keep_on_filesystem_after_upload_to_s3?
            true
          end
        end
      end
    end
  end
end
