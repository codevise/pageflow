require 'spec_helper'

module Pageflow
  module PaperclipProcessors
    describe Webp do
      describe '#make' do
        it 'shrinks jpg correctly' do
          processor = Webp.new(fixture_1200x800_jpg, geometry: '600x300>')

          result = processor.make
          new_image = Vips::Image.new_from_file(result.path)

          expect(result.path).to end_with('.webp')
          expect(new_image.width).to eq(450)
          expect(new_image.height).to eq(300)
        end

        it 'does not shrink if already smaller' do
          processor = Webp.new(fixture_1200x800_jpg, geometry: '2000x2000>')

          result = processor.make
          new_image = Vips::Image.new_from_file(result.path)

          expect(result.path).to end_with('.webp')
          expect(new_image.width).to eq(1200)
          expect(new_image.height).to eq(800)
        end

        it 'supports cropping' do
          processor = Webp.new(fixture_1200x800_jpg, geometry: '600x300#')

          result = processor.make
          new_image = Vips::Image.new_from_file(result.path)

          expect(result.path).to end_with('.webp')
          expect(new_image.width).to eq(600)
          expect(new_image.height).to eq(300)
        end

        it 'can crop images smaller than crop area' do
          processor = Webp.new(fixture_7x15_png, geometry: '40x40#')

          result = processor.make
          new_image = Vips::Image.new_from_file(result.path)

          expect(result.path).to end_with('.webp')
          expect(new_image.width).to eq(40)
          expect(new_image.height).to eq(40)
        end

        it 'handles gif files' do
          processor = Webp.new(fixture_1x1_gif, geometry: '600x300>')

          result = processor.make
          new_image = Vips::Image.new_from_file(result.path)

          expect(result.path).to end_with('.webp')
          expect(new_image.width).to eq(1)
          expect(new_image.height).to eq(1)
        end

        def fixture_7x15_png
          File.open(Engine.root.join('spec', 'fixtures', 'image.png'))
        end

        def fixture_1200x800_jpg
          File.open(Engine.root.join('spec', 'fixtures', 'image.jpg'))
        end

        def fixture_1x1_gif
          File.open(Engine.root.join('spec', 'fixtures', 'image.gif'))
        end
      end
    end
  end
end
