require 'spec_helper'

module Pageflow
  describe ImageFile do
    let!(:fixture_file) { File.open(Engine.root.join('spec', 'fixtures', '7x15.png')) }
    let!(:broken_fixture_file) { File.open(Engine.root.join('spec', 'fixtures', 'broken.jpg')) }

    it 'saves image width and height of original attachment' do
      image_file = create(:image_file, attachment: fixture_file)
      image_file.reload

      expect(image_file.width).to eq(7)
      expect(image_file.height).to eq(15)
    end

    it 'sets width and height to nil if image cannot be identified' do
      image_file = create(:image_file, attachment: broken_fixture_file)
      image_file.reload

      expect(image_file.width).to be_nil
      expect(image_file.height).to be_nil
    end

    it 'is invalid if attachment is missing' do
      image_file = build(:image_file, attachment: nil)

      image_file.valid?
      expect(image_file).to have(1).errors_on(:attachment)
    end

    it 'is valid if attachment is present' do
      image_file = build(:image_file, attachment: fixture_file)

      expect(image_file).to be_valid
    end

    describe 'attachment_styles' do
      let!(:png_fixture_file) { File.open(Engine.root.join('spec', 'fixtures', 'image.png')) }
      let!(:jpg_fixture_file) { File.open(Engine.root.join('spec', 'fixtures', 'image.jpg')) }
      let!(:gif_fixture_file) { File.open(Engine.root.join('spec', 'fixtures', 'image.gif')) }

      it 'includes Pageflow.config.thumbnail_styles' do
        Pageflow.config.thumbnail_styles[:square] = '100x100'

        image_file = create(:image_file)
        styles = image_file.attachment_styles(image_file.attachment)

        expect(styles[:square]).to eq('100x100')
      end

      it 'turns png file into jpg for non panorama styles' do
        image_file = create(:image_file, attachment: png_fixture_file)
        styles = image_file.attachment_styles(image_file.attachment)

        expect(styles[:medium][:format]).to eq(:JPG)
      end

      it 'preserves png file extension for panorama styles' do
        image_file = create(:image_file, attachment: png_fixture_file)
        styles = image_file.attachment_styles(image_file.attachment)

        expect(styles[:panorama_large][:format]).to eq(:PNG)
      end

      it 'preserves jpg file extension for panorama styles' do
        image_file = create(:image_file, attachment: jpg_fixture_file)
        styles = image_file.attachment_styles(image_file.attachment)

        expect(styles[:panorama_large][:format]).to eq(:JPG)
      end

      it 'turns gif file into jpg for panorama styles' do
        image_file = create(:image_file, attachment: gif_fixture_file)
        styles = image_file.attachment_styles(image_file.attachment)

        expect(styles[:panorama_large][:format]).to eq(:JPG)
      end
    end

    describe 'basename' do
      it 'returns the original file name without extention' do
        image_file = build(:image_file, attachment_file_name: 'image.jpg')

        expect(image_file.basename).to eq('image')
      end
    end
  end
end
