require 'spec_helper'

module Pageflow
  module Admin
    describe LocalesHelper do
      describe '#available_locales_collection' do
        it 'returns collection of configured available locales for select' do
          Pageflow.config.available_locales = [:de]

          pairs = available_locales_collection

          expect(pairs).to eq([['Deutsch', 'de']])
        end
      end

      describe '#available_public_locales_collection' do
        it 'returns collection of configured available public locales for select' do
          Pageflow.config.available_public_locales = [:de, :en, :fr]

          pairs = available_public_locales_collection

          expect(pairs).to eq([['Deutsch', 'de'], ['English', 'en'], ['Français', 'fr']])
        end
      end
    end
  end
end
