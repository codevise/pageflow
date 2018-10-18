require 'spec_helper'

require 'pageflow/lint'

module Pageflow
  describe BuiltInFileType do
    it 'provides a file type under #image' do
      expect(BuiltInFileType.image).to be_a(Pageflow::FileType)
    end

    it 'provides a file type under #video' do
      expect(BuiltInFileType.video).to be_a(Pageflow::FileType)
    end

    it 'provides a file type under #audio' do
      expect(BuiltInFileType.audio).to be_a(Pageflow::FileType)
    end
  end

  Pageflow::Lint.file_type('image_file',
                           create_file_type: -> { BuiltInFileType.image },
                           create_file: -> { create(:image_file) })

  Pageflow::Lint.file_type('video_file',
                           create_file_type: -> { BuiltInFileType.video },
                           create_file: -> { create(:video_file) })

  Pageflow::Lint.file_type('audio_file',
                           create_file_type: -> { BuiltInFileType.audio },
                           create_file: -> { create(:audio_file) })
end
