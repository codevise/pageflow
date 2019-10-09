require 'spec_helper'

module Pageflow
  describe PageTypesHelper do
    describe '#page_type_json_seeds' do
      it 'renders custom json seed template' do
        page_type = TestPageType.new(name: 'test', json_seed_template: 'pageflow/test/page')
        config = Configuration.new
        config.page_types.register(page_type)

        stub_template('pageflow/test/page.json.jbuilder' => 'json.key "value"')
        result = helper.page_type_json_seeds(config)

        expect(result).to include('"key":"value"')
      end

      it 'only renders basic properties if json seed template is nil' do
        page_type = TestPageType.new(name: 'test', json_seed_template: nil)
        config = Configuration.new
        config.page_types.register(page_type)

        result = helper.page_type_json_seeds(config)

        expect(result).to include('"name":"test"')
      end

      it 'includes thumbnail_candidates' do
        page_type = TestPageType.new(name: 'test',
                                     thumbnail_candidates: [
                                       {
                                         attribute: 'thumbnail_image_id',
                                         file_collection: 'image_files'
                                       }
                                     ])
        config = Configuration.new
        config.page_types.register(page_type)

        result = JSON.parse(helper.page_type_json_seeds(config))
        candidate = result[0]['thumbnail_candidates'][0]

        expect(candidate['attribute']).to eq('thumbnail_image_id')
        expect(candidate['file_collection']).to eq('image_files')
      end

      it 'includes thumbnail_candidates with condition' do
        page_type = TestPageType.new(name: 'test',
                                     thumbnail_candidates: [
                                       {
                                         attribute: 'background_image_id',
                                         file_collection: 'image_files',
                                         if: {attribute: 'background_type', value: 'image'}
                                       }
                                     ])
        config = Configuration.new
        config.page_types.register(page_type)

        result = JSON.parse(helper.page_type_json_seeds(config))
        candidate = result[0]['thumbnail_candidates'][0]

        expect(candidate['condition']['attribute']).to eq('background_type')
        expect(candidate['condition']['value']).to eq('image')
        expect(candidate['condition']['negated']).to eq(false)
      end

      it 'includes thumbnail_candidates with negated condition' do
        page_type = TestPageType.new(name: 'test',
                                     thumbnail_candidates: [
                                       {
                                         attribute: 'background_image_id',
                                         file_collection: 'image_files',
                                         unless: {attribute: 'background_type', value: 'image'}
                                       }
                                     ])
        config = Configuration.new
        config.page_types.register(page_type)

        result = JSON.parse(helper.page_type_json_seeds(config))
        candidate = result[0]['thumbnail_candidates'][0]

        expect(candidate['condition']['attribute']).to eq('background_type')
        expect(candidate['condition']['value']).to eq('image')
        expect(candidate['condition']['negated']).to eq(true)
      end
    end

    describe '#page_type_templates' do
      before do
        controller.singleton_class.class_eval do
          helper_method :render_to_string
        end
      end

      it 'renders page templates in script tags' do
        page_type = TestPageType.new(name: 'test',
                                     template_path: 'pageflow/test/page')
        Pageflow.config.page_types.register(page_type)
        entry = build(:entry)

        stub_template('pageflow/test/page.html.erb' => 'template')

        result = helper.page_type_templates(entry)

        expect(result).to have_selector('script[data-template=test_page]', :text => 'template', :visible => false)
      end
    end
  end
end
