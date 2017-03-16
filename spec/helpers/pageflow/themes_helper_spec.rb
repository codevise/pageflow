require 'spec_helper'

module Pageflow
  describe ThemesHelper do
    describe '#themes_options_json_seed' do
      it 'returns theme options' do
        Pageflow.config.themes.register(:theme_with_options, some_option: 'value')

        result = JSON.parse(helper.themes_options_json_seed(Pageflow.config))

        expect(result['theme_with_options']).to eq('some_option' => 'value')
      end
    end
  end
end
