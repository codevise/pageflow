require 'spec_helper'

module Pageflow
  describe ConfigHelper do
    before { helper.extend(RenderJsonHelper) }

    describe '#config_file_url_templates_seed' do
      it 'renders url templates of registered file types' do
        url_template = 'files/:id_partition/video.mp4'
        config = Configuration.new
        config.file_types.register(FileType.new(model: 'Pageflow::VideoFile',
                                                collection_name: 'test_files',
                                                url_templates: -> { {original: url_template} }))

        result = helper.render_json do |json|
          helper.config_file_url_templates_seed(json, config)
        end

        expect(result).to include_json(test_files: {original: url_template})
      end

      it 'supports camel case key format' do
        url_template = 'files/:id_partition/video.mp4'
        config = Configuration.new
        config.file_types.register(FileType.new(model: 'Pageflow::VideoFile',
                                                collection_name: 'test_files',
                                                url_templates: -> { {high_def: url_template} }))

        result = helper.render_json do |json|
          json.key_format!(camelize: :lower)
          helper.config_file_url_templates_seed(json, config)
        end

        expect(result).to include_json(testFiles: {highDef: url_template})
      end
    end

    describe '#config_file_model_types_seed' do
      it 'contains mapping of file type collection name to model type name' do
        config = Configuration.new
        config.file_types.register(FileType.new(model: 'Pageflow::VideoFile',
                                                collection_name: 'test_files'))

        result = helper.render_json do |json|
          helper.config_file_model_types_seed(json, config)
        end

        expect(result).to include_json(test_files: 'Pageflow::VideoFile')
      end

      it 'supports camel case key format' do
        config = Configuration.new
        config.file_types.register(FileType.new(model: 'Pageflow::VideoFile',
                                                collection_name: 'test_files'))

        result = helper.render_json do |json|
          json.key_format!(camelize: :lower)
          helper.config_file_model_types_seed(json, config)
        end

        expect(result).to include_json(testFiles: 'Pageflow::VideoFile')
      end
    end
  end
end
