require 'spec_helper'

module Pageflow
  describe PageTypesHelper do
    describe '#page_type_json_seeds' do
      it 'renders custom json seed template' do
        class TestPageType < Pageflow::PageType
          name 'test'

          def json_seed_template
            'pageflow/test/page'
          end
        end

        allow(Pageflow.config).to receive(:page_types).and_return([TestPageType.new])
        stub_template('pageflow/test/page.json.jbuilder' => 'json.key "value"')

        result = helper.page_type_json_seeds

        expect(result).to include('"key":"value"')
      end

      it 'only renders basic properties if json seed template is nil' do
        class TestPageType < Pageflow::PageType
          name 'test'

          def json_seed_template
          end
        end

        allow(Pageflow.config).to receive(:page_types).and_return([TestPageType.new])

        result = helper.page_type_json_seeds

        expect(result).to include('"name":"test"')
      end

      it 'includes thumbnail_candidates' do
        page_type_class = Class.new(Pageflow::PageType) do
          name 'test'

          def thumbnail_candidates
            [{attribute: 'thumbnail_image_id', file_collection: 'image_files'}]
          end
        end

        allow(Pageflow.config).to receive(:page_types).and_return([page_type_class.new])

        result = JSON.parse(helper.page_type_json_seeds)

        expect(result[0]['thumbnail_candidates']).to eq([{'attribute' => 'thumbnail_image_id', 'file_collection' => 'image_files'}])
      end
    end

    describe '#page_type_templates' do
      before do
        controller.singleton_class.class_eval do
          helper_method :render_to_string
        end
      end

      it 'renders page templates in script tags' do
        class TestPageType < Pageflow::PageType
          name 'test'

          def template_path
            'pageflow/test/page'
          end
        end

        allow(Pageflow.config).to receive(:page_types).and_return([TestPageType.new])
        stub_template('pageflow/test/page.html.erb' => 'template')

        result = helper.page_type_templates

        expect(result).to have_selector('script[data-template=test_page]', :text => 'template', :visible => false)
      end
    end
  end
end
