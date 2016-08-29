require 'spec_helper'

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
end
