module Pageflow
  FactoryGirl.define do
    factory :text_track_file, class: TextTrackFile do
      entry
      uploader { create(:user) }
      parent_file { create(:video_file) }

      attachment_on_s3 File.open(Engine.root.join('spec', 'fixtures', 'sample.vtt'))

      trait :on_filesystem do
        attachment_on_filesystem File.open(Engine.root.join('spec', 'fixtures', 'et.ogg'))
        attachment_on_s3 nil
        state 'not_uploaded_to_s3'
      end

      trait :uploading_to_s3_failed do
        attachment_on_filesystem File.open(Engine.root.join('spec', 'fixtures', 'et.ogg'))
        attachment_on_s3 nil
        state 'uploading_to_s3_failed'
      end
    end
  end
end
