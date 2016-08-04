require 'spec_helper'

module Pageflow
  describe ImageFile do
    it 'saves image width and height of original attachment' do
      image_file = create(:image_file, :unprocessed_attachment => File.open(Engine.root.join('spec', 'fixtures', '7x15.png')))
      image_file.reload

      expect(image_file.width).to eq(7)
      expect(image_file.height).to eq(15)
    end

    it 'sets width and height to nil if image cannot be identied' do
      image_file = create(:image_file, :attachment => File.open(Engine.root.join('spec', 'fixtures', 'broken.jpg')))
      image_file.reload

      expect(image_file.width).to be_nil
      expect(image_file.height).to be_nil
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
  end

  describe 'basename' do
    it 'returns the original file name without extention' do
      image_file = build(:image_file, processed_attachment_file_name: 'image.jpg')

      expect(image_file.basename).to eq('image')
    end
  end
end
