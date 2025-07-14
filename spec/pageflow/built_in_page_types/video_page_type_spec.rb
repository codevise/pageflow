require 'spec_helper'

require 'pageflow/lint'
require 'pageflow/matchers/have_json_ld'

module Pageflow
  Pageflow::Lint.page_type(BuiltInPageType.video)

  describe 'built in video page type', type: :helper do
    include RenderPageTestHelper

    it 'renders structured data for video file' do
      upload_date = 2.day.ago
      publication_date = 1.day.ago

      revision = create(:revision, :published, published_at: publication_date)
      video_file = create(:video_file,
                          file_name: 'some-video.mp4',
                          used_in: revision,
                          with_configuration: {alt: 'some alt text'},
                          created_at: upload_date,
                          width: 100,
                          height: 200,
                          output_presences: {high: true},
                          poster_file_name: 'poster-0.jpg',
                          rights: 'some author',
                          duration_in_ms: (3 * 60 + 43) * 1000 + 120)

      file_usage = revision.file_usages.first

      page = create(:page,
                    template: 'video',
                    revision:,
                    configuration: {video_file_id: file_usage.perma_id})

      html = render_page(page)

      expect(html).to have_json_ld('@context' => 'http://schema.org',
                                   '@type' => 'VideoObject',
                                   'name' => 'some-video',
                                   'description' => 'some alt text',
                                   'url' => video_file.mp4_high.url,
                                   'thumbnailUrl' => video_file.poster.url(:medium),
                                   'width' => 100,
                                   'height' => 200,
                                   'duration' => 'PT3M43S',
                                   'datePublished' => publication_date.iso8601,
                                   'uploadDate' => upload_date.iso8601,
                                   'copyrightHolder' => {
                                     '@type' => 'Organization',
                                     'name' => 'some author'
                                   })
    end
  end
end
