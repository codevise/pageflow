require 'spec_helper'

module Pageflow
  describe PositionedFile do
    describe '#thumbnail_url' do
      it 'delegates to wrapped file' do
        image_file = create(:image_file)
        result = PositionedFile.wrap(image_file, 60, 40)

        expect(result.thumbnail_url(:thumbnail)).to eq(image_file.thumbnail_url(:thumbnail))
      end
    end

    describe '.wrap' do
      it 'returns nil for nil' do
        result = PositionedFile.wrap(nil, 50, 50)

        expect(result).to be(nil)
      end

      it 'returns PositionedFile for file' do
        image_file = create(:image_file)
        result = PositionedFile.wrap(image_file, 60, 40)

        expect(result).to eq(image_file)
        expect(result.position_x).to be(60)
        expect(result.position_y).to be(40)
      end
    end

    describe PositionedFile::Null do
      describe '#thumbnail_url' do
        it 'returns placeholder url' do
          file = PositionedFile::Null.new

          expect(file.thumbnail_url).to match(/placeholder/)
        end
      end

      describe '#position_x/positions_y' do
        it 'returns default value' do
          file = PositionedFile::Null.new

          expect(file.position_x).to eq(50)
          expect(file.position_y).to eq(50)
        end
      end
    end
  end
end
