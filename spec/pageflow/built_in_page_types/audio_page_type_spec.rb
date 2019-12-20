require 'spec_helper'

require 'pageflow/lint'
require 'pageflow/matchers/have_json_ld'

module Pageflow
  Pageflow::Lint.page_type(BuiltInPageType.audio)

  describe 'built in audio page type', type: :helper do
    include RenderPageTestHelper

    it 'renders structured data for audio file' do
      upload_date = 2.day.ago
      publication_date = 1.day.ago
      revision = create(:revision, :published, published_at: publication_date)
      audio_file = create(:audio_file,
                          file_name: 'some-audio.mp3',
                          used_in: revision,
                          with_configuration: {alt: 'some alt text'},
                          created_at: upload_date,
                          rights: 'some author',
                          duration_in_ms: (3 * 60 + 43) * 1000 + 120)

      file_usage = revision.file_usages.first

      page = create(:page,
                    template: 'audio',
                    revision: revision,
                    configuration: {audio_file_id: file_usage.perma_id})

      html = render_page(page)

      expect(html).to have_json_ld('@context' => 'http://schema.org',
                                   '@type' => 'AudioObject',
                                   'name' => 'some-audio',
                                   'description' => 'some alt text',
                                   'url' => audio_file.mp3.url,
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
