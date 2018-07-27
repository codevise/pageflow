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
        Pageflow.config.themes.register(:test_theme)

        result = JSON.parse(helper.theme_json_seeds(Pageflow.config)).last

        expect(result['name']).to eq('test_theme')
        expect(result['preview_image_url']).to(
          match(%r'http://test\.host/assets/pageflow/themes/test_theme/preview-[a-f0-9]+\.png')
        )
      end
    end
  end
end
