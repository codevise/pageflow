require 'spec_helper'

module PageflowScrolled
  RSpec.describe LottieFile do
    it 'can be created for uploads with lottie extension' do
      entry = Pageflow::DraftEntry.new(create(:entry, type_name: 'scrolled'))

      file = entry.create_file!(PageflowScrolled.lottie_file_type,
                                display_name: 'animation.lottie')

      expect(file.file_name).to end_with('.lottie')
    end

    it 'exposes basename of attachment for url template interpolation' do
      lottie_file = create(:lottie_file)

      expect(lottie_file.basename).to eq('animation')
    end

    it 'exposes extension of attachment for url template interpolation' do
      lottie_file = create(:lottie_file)

      expect(lottie_file.extension).to eq('lottie')
    end
  end
end
