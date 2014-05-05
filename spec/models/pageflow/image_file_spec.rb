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
  end
end
