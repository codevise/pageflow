require 'spec_helper'

module Pageflow
  module PaperclipProcessors
    describe Vtt do
      describe 'for vtt file' do
        let :vtt_file do
          File.open(Engine.root.join('spec', 'fixtures', 'sample.vtt'))
        end

        it 'returns vtt tempfile' do
          processor = Vtt.new(vtt_file)

          file = processor.make

          expect(file.path).to match(/tmp.*\.vtt$/)
          expect(file.read).to match(/^WEBVTT/)
        end
      end

      describe 'for srt file' do
        let :srt_file do
          File.open(Engine.root.join('spec', 'fixtures', 'sample.srt'))
        end

        it 'returns vtt tempfile' do
          processor = Vtt.new(srt_file)

          file = processor.make

          expect(file.path).to match(/tmp.*\.vtt$/)
          expect(file.read).to match(/^WEBVTT/)
        end
      end
    end
  end
end
