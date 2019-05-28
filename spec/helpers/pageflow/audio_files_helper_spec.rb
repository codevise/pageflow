require 'spec_helper'
require 'pageflow/revision_file_test_helper'

module Pageflow
  describe AudioFilesHelper do
    include RevisionFileTestHelper

    describe '#audio_file_audio_tag' do
      it 'renders audio tag for audio file with sources' do
        audio_file = create(:audio_file)
        entry_has_file(audio_file)
        html = helper.audio_file_audio_tag(audio_file.id)

        expect(html).to have_selector('audio source')
      end
    end

    describe '#audio_file_script_tag' do
      it 'renders json script tag' do
        audio_file = create(:audio_file)
        entry_has_file(audio_file)
        html = helper.audio_file_script_tag(audio_file.id)

        expect(html).to have_selector('script', text: 'src', visible: false)
      end
    end
  end
end
