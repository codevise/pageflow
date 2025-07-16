require 'spec_helper'

module Pageflow
  describe ThumbnailFileResolver do
    include UsedFileTestHelper

    describe '#find_thumbnail' do
      it 'returns first exisiting file' do
        entry = PublishedEntry.new(create(:entry, :published))
        image_file = create_used_file(:image_file, entry:)
        candidates = [
          {attribute: 'thumbnail_id', file_collection: 'image_files'}
        ]
        configuration = {'thumbnail_id' => image_file.perma_id}
        resolver = ThumbnailFileResolver.new(entry, candidates, configuration)

        file = resolver.find_thumbnail

        expect(file).to eq(image_file)
      end

      it 'skips missing records' do
        entry = PublishedEntry.new(create(:entry, :published))
        image_file = create_used_file(:image_file, entry:)
        candidates = [
          {attribute: 'missing_id', file_collection: 'image_files'},
          {attribute: 'thumbnail_id', file_collection: 'image_files'}
        ]
        configuration = {'missing_id' => -1, 'thumbnail_id' => image_file.perma_id}
        resolver = ThumbnailFileResolver.new(entry, candidates, configuration)

        file = resolver.find_thumbnail

        expect(file).to eq(image_file)
      end

      it 'skips missing attributes' do
        entry = PublishedEntry.new(create(:entry, :published))
        image_file = create_used_file(:image_file, entry:)
        candidates = [
          {attribute: 'missing_id', file_collection: 'image_files'},
          {attribute: 'thumbnail_id', file_collection: 'image_files'}
        ]
        configuration = {'thumbnail_id' => image_file.perma_id}
        resolver = ThumbnailFileResolver.new(entry, candidates, configuration)

        file = resolver.find_thumbnail

        expect(file).to eq(image_file)
      end

      it 'returns blank null object if no match is found' do
        entry = PublishedEntry.new(create(:entry, :published))
        candidates = [
          {attribute: 'missing_id', file_collection: 'image_files'}
        ]
        configuration = {}
        resolver = ThumbnailFileResolver.new(entry, candidates, configuration)

        file = resolver.find_thumbnail

        expect(file).to be_blank
        expect(file.position_x).to eq(50)
        expect(file.position_y).to eq(50)
      end

      it 'returns positioned file with coordinates from configuration' do
        entry = PublishedEntry.new(create(:entry, :published))
        image_file = create_used_file(:image_file, entry:)
        candidates = [
          {attribute: 'thumbnail_id', file_collection: 'image_files'}
        ]
        configuration = {'thumbnail_id' => image_file.perma_id, 'thumbnail_x' => 20,
                         'thumbnail_y' => 30}
        resolver = ThumbnailFileResolver.new(entry, candidates, configuration)

        file = resolver.find_thumbnail

        expect(file.position_x).to eq(20)
        expect(file.position_y).to eq(30)
      end

      it 'returns positioned file with default coordinates' do
        entry = PublishedEntry.new(create(:entry, :published))
        image_file = create_used_file(:image_file, entry:)
        candidates = [
          {attribute: 'thumbnail_id', file_collection: 'image_files'}
        ]
        configuration = {'thumbnail_id' => image_file.perma_id}
        resolver = ThumbnailFileResolver.new(entry, candidates, configuration)

        file = resolver.find_thumbnail

        expect(file.position_x).to eq(50)
        expect(file.position_y).to eq(50)
      end

      context 'with conditions' do
        it 'skips candidate if condition is not met' do
          entry = PublishedEntry.new(create(:entry, :published))
          image_file = create_used_file(:image_file, entry:)
          panorama_image_file = create_used_file(:image_file, entry:)
          candidates = [
            {
              attribute: 'panorama_id',
              file_collection: 'image_files',
              if: {attribute: 'background_type', value: 'panorama'}
            },
            {
              attribute: 'image_id',
              file_collection: 'image_files',
              if: {attribute: 'background_type', value: 'image'}
            }
          ]
          configuration = {
            'background_type' => 'image',
            'panorama_id' => panorama_image_file.perma_id,
            'image_id' => image_file.perma_id
          }
          resolver = ThumbnailFileResolver.new(entry, candidates, configuration)

          file = resolver.find_thumbnail

          expect(file).to eq(image_file)
        end

        it 'skips candidate if condition given via unless is met' do
          entry = PublishedEntry.new(create(:entry, :published))
          image_file = create_used_file(:image_file, entry:)
          panorama_image_file = create_used_file(:image_file, entry:)
          candidates = [
            {
              attribute: 'panorama_id',
              file_collection: 'image_files',
              unless: {attribute: 'background_type', value: 'panorama'}
            },
            {
              attribute: 'image_id',
              file_collection: 'image_files',
              unless: {attribute: 'background_type', value: 'image'}
            }
          ]
          configuration = {
            'background_type' => 'panorama',
            'panorama_id' => panorama_image_file.perma_id,
            'image_id' => image_file.perma_id
          }
          resolver = ThumbnailFileResolver.new(entry, candidates, configuration)

          file = resolver.find_thumbnail

          expect(file).to eq(image_file)
        end

        it 'raises helpful error when condition does not have attribute and value keys' do
          entry = PublishedEntry.new(create(:entry, :published))
          candidates = [
            {
              attribute: 'panorama_id',
              file_collection: 'image_files',
              if: {value: 'panorama'}
            }
          ]
          configuration = {}
          resolver = ThumbnailFileResolver.new(entry, candidates, configuration)

          expect {
            resolver.find_thumbnail
          }.to raise_error(/Expected thumbnail candidate condition to have keys/)
        end
      end
    end
  end
end
