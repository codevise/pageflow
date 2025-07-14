require 'spec_helper'

module Pageflow
  describe ImageFile do
    it 'is invalid if attachment is missing' do
      image_file = build(:image_file, :uploading, file_name: nil)

      image_file.valid?
      expect(image_file).to have(1).errors_on(:attachment_on_s3)
    end

    it 'is valid if attachment is present' do
      image_file = build(:image_file, :uploading)

      expect(image_file).to be_valid
    end

    describe 'attachment_styles' do
      it 'includes Pageflow.config.thumbnail_styles' do
        Pageflow.config.thumbnail_styles[:square] = {
          geometry: '100x100', format: :JPG
        }

        image_file = build(:image_file, :uploading, file_name: 'image.jpg')
        styles = image_file.attachment_styles(image_file.attachment)

        expect(styles[:square]).to eq(geometry: '100x100', format: :JPG)
      end

      it 'turns png file into jpg for non panorama styles' do
        image_file = build(:image_file, :uploading, file_name: 'image.png')
        styles = image_file.attachment_styles(image_file.attachment)

        expect(styles[:medium][:format]).to eq(:JPG)
      end

      it 'preserves png file extension for panorama styles' do
        image_file = build(:image_file, :uploading, file_name: 'image.png')
        styles = image_file.attachment_styles(image_file.attachment)

        expect(styles[:panorama_large][:format]).to eq(:PNG)
      end

      it 'preserves jpg file extension for panorama styles' do
        image_file = build(:image_file, :uploading, file_name: 'image.jpg')
        styles = image_file.attachment_styles(image_file.attachment)

        expect(styles[:panorama_large][:format]).to eq(:JPG)
      end

      it 'turns gif file into jpg for panorama styles' do
        image_file = build(:image_file, :uploading, file_name: 'image.gif')
        styles = image_file.attachment_styles(image_file.attachment)

        expect(styles[:panorama_large][:format]).to eq(:JPG)
      end

      it 'resizes panorama if original is larger than target in both dimensions' do
        image_file = build(:image_file, :uploading, width: 3000, height: 1500)
        styles = image_file.attachment.styles

        expect(styles[:panorama_large].processor_options[:geometry]).to eq('1920x1080^')
        expect(styles[:panorama_medium].processor_options[:geometry]).to eq('1024x1024^')
      end

      it 'does not resize panorama if original is smaller than target in one dimensions' do
        image_file = build(:image_file, :uploading, width: 2000, height: 1000)
        styles = image_file.attachment.styles

        expect(styles[:panorama_large].processor_options[:geometry]).to eq('100%')
        expect(styles[:panorama_medium].processor_options[:geometry]).to eq('100%')
      end

      it 'does generate social style by default' do
        image_file = build(:image_file, :uploading, width: 2000, height: 1000)
        styles = image_file.attachment.styles

        expect(styles).not_to have_key(:social)
      end

      describe 'with webp outputs' do
        it 'turns jpg file into webp files' do
          Pageflow.config.thumbnail_styles[:square] = {
            geometry: '100x100', format: :JPG
          }

          image_file = build(:image_file,
                             :uploading,
                             file_name: 'image.jpg',
                             output_presences: {
                               webp: true
                             })

          styles = image_file.attachment_styles(image_file.attachment)

          expect(styles[:medium][:format]).to eq(:webp)
          expect(styles[:large][:format]).to eq(:webp)
          expect(styles[:ultra][:format]).to eq(:webp)
          expect(styles[:square][:format]).to eq(:webp)

          expect(styles[:medium][:processors]).to eq([:pageflow_webp])
        end
      end

      describe 'with social output' do
        it 'keeps social image as jpg for compatibility reasons' do
          image_file = build(:image_file,
                             :uploading,
                             file_name: 'image.jpg',
                             output_presences: {
                               social: true
                             })

          styles = image_file.attachment_styles(image_file.attachment)

          expect(styles[:social][:format]).to eq(:jpg)
        end
      end
    end

    describe 'basename' do
      it 'returns the original file name without extention' do
        image_file = build(:image_file, :uploading, file_name: 'image.jpg')

        expect(image_file.basename).to eq('image')
      end
    end

    describe 'thumbnail_url' do
      it 'returns a placeholder unless image is processed' do
        image_file = build(:image_file, :uploading, file_name: 'image.jpg')

        expect(image_file.thumbnail_url(:medium)).to match(/placeholder/)
      end
    end

    describe '#reprocess!' do
      it 'does not set output presences by default' do
        entry = create(:entry)
        image_file = create(:image_file, :uploaded, entry:)

        image_file.attachment.reprocess!

        expect(image_file.reload.present_outputs).to eq([])
      end

      it 'sets output presences based on entry feature flag' do
        entry = create(:entry, with_feature: 'webp_images')
        image_file = create(:image_file, :uploaded, entry:)

        image_file.attachment.reprocess!

        expect(image_file.reload.present_outputs).to eq([:webp, :social])
      end

      it 'does not fail if entry is missing' do
        image_file = create(:image_file, :uploaded, entry: nil)

        image_file.attachment.reprocess!

        expect(image_file.reload.present_outputs).to eq([])
      end
    end
  end
end
