require 'spec_helper'
require 'tmpdir'

module PageflowScrolled
  RSpec.describe ConfigurationSchemas do
    describe '#find' do
      it 'returns schema registered for subject' do
        schemas = ConfigurationSchemas.new(
          [{'x-subject' => {'model' => 'contentElement', 'typeName' => 'hotspots'},
            'properties' => {'image' => {'x-fileCollection' => 'image_files'}}}]
        )

        schema = schemas.find(model: 'contentElement', type_name: 'hotspots')

        expect(schema['properties']).to eq('image' => {'x-fileCollection' => 'image_files'})
      end

      it 'returns schema for subject without type name' do
        schemas = ConfigurationSchemas.new(
          [{'x-subject' => {'model' => 'section'},
            'properties' => {'backdrop' => {}}}]
        )

        expect(schemas.find(model: 'section')).to be_present
      end

      it 'returns nil for unknown subject' do
        schemas = ConfigurationSchemas.new(
          [{'x-subject' => {'model' => 'contentElement', 'typeName' => 'hotspots'}}]
        )

        expect(schemas.find(model: 'contentElement', type_name: 'inlineImage')).to be_nil
      end

      it 'returns nil without documents' do
        schemas = ConfigurationSchemas.new([])

        expect(schemas.find(model: 'section')).to be_nil
      end

      it 'merges properties of multiple schemas for the same subject' do
        schemas = ConfigurationSchemas.new(
          [{'x-subject' => {'model' => 'section'},
            'properties' => {'backdropImage' => {'x-fileCollection' => 'image_files'}}},
           {'x-subject' => {'model' => 'section'},
            'properties' => {'backdropVideo' => {'x-fileCollection' => 'video_files'}}}]
        )

        schema = schemas.find(model: 'section')

        expect(schema['properties'].keys).to contain_exactly('backdropImage', 'backdropVideo')
      end

      it 'merges defs of multiple schemas for the same subject' do
        schemas = ConfigurationSchemas.new(
          [{'x-subject' => {'model' => 'section'}, '$defs' => {'area' => {'type' => 'object'}}},
           {'x-subject' => {'model' => 'section'}, '$defs' => {'link' => {'type' => 'object'}}}]
        )

        expect(schemas.find(model: 'section')['$defs'].keys).to contain_exactly('area', 'link')
      end

      it 'raises when two schemas for the same subject define the same property' do
        schemas = ConfigurationSchemas.new(
          [{'x-subject' => {'model' => 'section'}, 'properties' => {'backdropImage' => {}}},
           {'x-subject' => {'model' => 'section'}, 'properties' => {'backdropImage' => {}}}]
        )

        expect { schemas.find(model: 'section') }.to raise_error(/backdropImage/)
      end
    end

    describe '#find_by_id' do
      it 'returns schema without subject' do
        schemas = ConfigurationSchemas.new(
          [{'$id' => 'pageflow-scrolled/common/position',
            'properties' => {'position' => {}}}]
        )

        expect(schemas.find_by_id('pageflow-scrolled/common/position')).to be_present
      end

      it 'returns schema bound to a subject' do
        schemas = ConfigurationSchemas.new(
          [{'$id' => 'pageflow-scrolled/contentElements/hotspots',
            'x-subject' => {'model' => 'contentElement', 'typeName' => 'hotspots'}}]
        )

        expect(schemas.find_by_id('pageflow-scrolled/contentElements/hotspots')).to be_present
      end

      it 'returns nil for unknown id' do
        schemas = ConfigurationSchemas.new([])

        expect(schemas.find_by_id('unknown')).to be_nil
      end
    end

    describe '#type_names' do
      it 'returns type names of subjects of model' do
        schemas = ConfigurationSchemas.new(
          [{'x-subject' => {'model' => 'contentElement', 'typeName' => 'hotspots'}},
           {'x-subject' => {'model' => 'contentElement', 'typeName' => 'inlineImage'}},
           {'x-subject' => {'model' => 'widget', 'typeName' => 'defaultNavigation'}},
           {'x-subject' => {'model' => 'section'}}]
        )

        expect(schemas.type_names(model: 'contentElement'))
          .to contain_exactly('hotspots', 'inlineImage')
      end

      it 'is empty for model without type names' do
        schemas = ConfigurationSchemas.new([{'x-subject' => {'model' => 'section'}}])

        expect(schemas.type_names(model: 'section')).to eq([])
      end
    end

    describe '.load' do
      it 'reads schemas from files matching glob' do
        dir = make_dir
        write_schema(dir, 'section.json', 'x-subject' => {'model' => 'section'})

        schemas = ConfigurationSchemas.load([File.join(dir, '*.json')])

        expect(schemas.find(model: 'section')).to be_present
      end

      it 'reads multiple schemas from a single file' do
        dir = make_dir
        write_schema(dir, 'all.json',
                     [{'x-subject' => {'model' => 'contentElement', 'typeName' => 'hotspots'}},
                      {'x-subject' => {'model' => 'section'}}])

        schemas = ConfigurationSchemas.load([File.join(dir, '*.json')])

        expect(schemas.find(model: 'contentElement', type_name: 'hotspots')).to be_present
        expect(schemas.find(model: 'section')).to be_present
      end

      it 'ignores load path entries that do not exist' do
        schemas = ConfigurationSchemas.load(['/does/not/exist/*.json'])

        expect(schemas.find(model: 'section')).to be_nil
      end

      it 'picks up changes to a schema file' do
        dir = make_dir
        write_schema(dir, 'section.json',
                     'x-subject' => {'model' => 'section'},
                     'properties' => {'backdropImage' => {}})

        expect(ConfigurationSchemas.load([File.join(dir, '*.json')])
                                   .find(model: 'section')['properties'].keys)
          .to eq(['backdropImage'])

        write_schema(dir, 'section.json',
                     'x-subject' => {'model' => 'section'},
                     'properties' => {'backdropVideo' => {}})

        expect(ConfigurationSchemas.load([File.join(dir, '*.json')])
                                   .find(model: 'section')['properties'].keys)
          .to eq(['backdropVideo'])
      end
    end

    describe 'entry type configuration' do
      it 'reads schemas from load path' do
        dir = make_dir
        write_schema(dir, 'section.json', 'x-subject' => {'model' => 'section'})

        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.configuration_schema_load_path << File.join(dir, '*.json')
          end
        end

        entry = create(:published_entry, type_name: 'scrolled')

        expect(Pageflow.config_for(entry).configuration_schemas.find(model: 'section'))
          .to be_present
      end
    end

    def make_dir
      Dir.mktmpdir.tap { |dir| after_examples << -> { FileUtils.remove_entry(dir) } }
    end

    # Files written within the same second would otherwise be
    # indistinguishable for caching.
    def write_schema(dir, name, content)
      path = File.join(dir, name)
      File.write(path, JSON.generate(content))
      File.utime(next_time, next_time, path)
    end

    def next_time
      @next_time = (@next_time || Time.now) + 1
    end

    def after_examples
      @after_examples ||= []
    end

    after do
      after_examples.each(&:call)
    end
  end
end
