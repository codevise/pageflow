require 'spec_helper'

module Pageflow
  describe Themes do
    describe '#register' do
      it 'defines theme' do
        themes = Themes.new

        themes.register(:custom)

        expect(themes.get(:custom)).to be_kind_of(Theme)
      end

      it 'allows passing options' do
        themes = Themes.new

        themes.register(:custom, no_home_button: true)

        expect(themes.get(:custom)).not_to have_home_button
      end
    end

    describe '#get' do
      it 'raises helpful error for missing theme' do
        themes = Themes.new

        expect {
          themes.get(:missing)
        }.to raise_error(/Unknown theme/)
      end
    end

    describe '#names' do
      it 'returns array of theme names as strings' do
        themes = Themes.new

        themes.register(:default)
        themes.register(:custom)

        expect(themes.names).to eq(['default', 'custom'])
      end
    end

    it 'is Enumarable' do
      themes = Themes.new

      themes.register(:default)
      themes.register(:custom)

      expect(themes.map(&:name)).to eq(['default', 'custom'])
    end
  end
end
