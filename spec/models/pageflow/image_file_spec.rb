require 'spec_helper'

module Pageflow
  describe ImageFile do
    it 'saves image width and height of original attachment' do
      image_file = create(:image_file, unprocessed_attachment: fixture_file)
      image_file.reload

      expect(image_file.width).to eq(7)
      expect(image_file.height).to eq(15)
    end

    it 'sets width and height to nil if image cannot be identied' do
      image_file = create(:image_file, attachment: broken_fixture_file)
      image_file.reload

      expect(image_file.width).to be_nil
      expect(image_file.height).to be_nil
    end

    it 'is invalid if attachment is missing' do
      image_file = build(:image_file, unprocessed_attachment: nil)

      image_file.valid?
      expect(image_file).to have(1).errors_on(:attachment)
    end

    it 'is valid if unprocessed_attachment is present' do
      image_file = build(:image_file, unprocessed_attachment: fixture_file)

      expect(image_file).to be_valid
    end

    describe '::STYLES#call' do
      it 'includes Pageflow.config.thumbnail_styles' do
        Pageflow.config.thumbnail_styles[:square] = '100x100'

        image_file = create(:image_file)
        styles = ImageFile::STYLES.call(image_file.unprocessed_attachment)

        expect(styles[:square]).to eq('100x100')
      end

      it 'turns png file into jpg for non panorama styles' do
        image_file = create(:image_file, attachment: File.open(Engine.root.join('spec', 'fixtures', 'image.png')))
        styles = ImageFile::STYLES.call(image_file.unprocessed_attachment)

        expect(styles[:medium][1]).to eq(:JPG)
      end

      it 'preserves png file extension for panorama styles' do
        image_file = create(:image_file, attachment: File.open(Engine.root.join('spec', 'fixtures', 'image.png')))
        styles = ImageFile::STYLES.call(image_file.unprocessed_attachment)

        expect(styles[:panorama_large][1]).to eq(:PNG)
      end

      it 'preserves jpg file extension for panorama styles' do
        image_file = create(:image_file, attachment: File.open(Engine.root.join('spec', 'fixtures', 'image.jpg')))
        styles = ImageFile::STYLES.call(image_file.unprocessed_attachment)

        expect(styles[:panorama_large][1]).to eq(:JPG)
      end

      it 'turns gif file into jpg for panorama styles' do
        image_file = create(:image_file, attachment: File.open(Engine.root.join('spec', 'fixtures', 'image.gif')))
        styles = ImageFile::STYLES.call(image_file.unprocessed_attachment)

        expect(styles[:panorama_large][1]).to eq(:JPG)
      end
    end

    describe 'basename' do
      it 'returns the original file name without extention' do
        image_file = build(:image_file, processed_attachment_file_name: 'image.jpg')

        expect(image_file.basename).to eq('image')
      end
    end

    def fixture_file
      File.open(Engine.root.join('spec', 'fixtures', '7x15.png'))
    end

    def broken_fixture_file
      File.open(Engine.root.join('spec', 'fixtures', 'broken.jpg'))
    end
  end
end
