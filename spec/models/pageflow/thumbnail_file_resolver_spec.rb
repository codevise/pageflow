require 'spec_helper'

module Pageflow
  describe ThumbnailFileResolver do
    describe '#find' do
      it 'returns first exisiting file' do
        image_file = create(:image_file)
        candidates = [
          {attribute: 'thumbnail_id', file_collection: 'image_files'}
        ]
        configuration = {'thumbnail_id' => image_file.id}
        resolver = ThumbnailFileResolver.new(candidates, configuration)

        file = resolver.find

        expect(file).to eq(image_file)
      end

      it 'skips missing records' do
        image_file = create(:image_file)
        candidates = [
          {attribute: 'missing_id', file_collection: 'image_files'},
          {attribute: 'thumbnail_id', file_collection: 'image_files'}
        ]
        configuration = {'missing_id' => -1, 'thumbnail_id' => image_file.id}
        resolver = ThumbnailFileResolver.new(candidates, configuration)

        file = resolver.find

        expect(file).to eq(image_file)
      end

      it 'skips missing attributes' do
        image_file = create(:image_file)
        candidates = [
          {attribute: 'missing_id', file_collection: 'image_files'},
          {attribute: 'thumbnail_id', file_collection: 'image_files'}
        ]
        configuration = {'thumbnail_id' => image_file.id}
        resolver = ThumbnailFileResolver.new(candidates, configuration)

        file = resolver.find

        expect(file).to eq(image_file)
      end

      it 'returns blank null object if no match is found' do
        candidates = [
          {attribute: 'missing_id', file_collection: 'image_files'}
        ]
        configuration = {}
        resolver = ThumbnailFileResolver.new(candidates, configuration)

        file = resolver.find

        expect(file).to be_blank
        expect(file.position_x).to eq(50)
        expect(file.position_y).to eq(50)
      end

      it 'returns positioned file with coordinates from configuration' do
        image_file = create(:image_file)
        candidates = [
          {attribute: 'thumbnail_id', file_collection: 'image_files'}
        ]
        configuration = {'thumbnail_id' => image_file.id, 'thumbnail_x' => 20, 'thumbnail_y' => 30}
        resolver = ThumbnailFileResolver.new(candidates, configuration)

        file = resolver.find

        expect(file.position_x).to eq(20)
        expect(file.position_y).to eq(30)
      end

      it 'returns positioned file with default coordinates' do
        image_file = create(:image_file)
        candidates = [
          {attribute: 'thumbnail_id', file_collection: 'image_files'}
        ]
        configuration = {'thumbnail_id' => image_file.id}
        resolver = ThumbnailFileResolver.new(candidates, configuration)

        file = resolver.find

        expect(file.position_x).to eq(50)
        expect(file.position_y).to eq(50)
      end
    end
  end
end
