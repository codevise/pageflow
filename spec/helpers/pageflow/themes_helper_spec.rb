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

    describe '#theme_json_seeds' do
      it 'renders basic properties' do
        config = Configuration.new
        config.themes.register(:test_theme)

        result = helper.theme_json_seeds(config)

        expect(result).to include('"name":"test_theme"')
        expect(result).to include('"preview_image_path":"pageflow/themes/test_theme/preview.png"')
      end
    end
  end
end
