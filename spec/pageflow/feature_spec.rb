require 'spec_helper'

module Pageflow
  describe Feature do
    describe '#name_translation_key' do
      it 'defaults to conventional string based on name' do
        feature = Feature.new('some-feature')

        expect(feature.name_translation_key).to eq('pageflow.some-feature.feature_name')
      end

      it 'can be overriden via initializer parameter' do
        feature = Feature.new('some-feature', name_translation_key: 'other')

        expect(feature.name_translation_key).to eq('other')
      end
    end
  end
end
