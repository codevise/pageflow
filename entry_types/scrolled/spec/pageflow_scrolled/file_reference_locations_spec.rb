require 'spec_helper'

module PageflowScrolled
  RSpec.describe FileReferenceLocations do
    it 'finds reference in top level property' do
      locations = FileReferenceLocations.new(ConfigurationSchemas.new([])).for(
        {'properties' => {'image' => {'x-fileCollection' => 'image_files'}}}
      )

      expect(locations).to eq([{'path' => ['image'], 'collection' => 'imageFiles'}])
    end

    it 'ignores properties without file collection' do
      locations = FileReferenceLocations.new(ConfigurationSchemas.new([])).for(
        {'properties' => {'invertTooltips' => {'type' => 'boolean'}}}
      )

      expect(locations).to eq([])
    end

    it 'includes condition' do
      locations = FileReferenceLocations.new(ConfigurationSchemas.new([])).for(
        {'properties' => {
          'backdropVideo' => {
            'x-fileCollection' => 'video_files',
            'x-activeIf' => {'path' => ['backdropType'], 'value' => 'video'}
          }
        }}
      )

      expect(locations.first['activeIf'])
        .to eq('path' => ['backdropType'], 'value' => 'video')
    end

    it 'finds reference in nested object' do
      locations = FileReferenceLocations.new(ConfigurationSchemas.new([])).for(
        {'properties' => {
          'tooltip' => {'properties' => {'image' => {'x-fileCollection' => 'image_files'}}}
        }}
      )

      expect(locations.first['path']).to eq(%w[tooltip image])
    end

    it 'finds reference in array items' do
      locations = FileReferenceLocations.new(ConfigurationSchemas.new([])).for(
        {'properties' => {
          'areas' => {
            'type' => 'array',
            'items' => {
              'properties' => {'tooltipImage' => {'x-fileCollection' => 'image_files'}}
            }
          }
        }}
      )

      expect(locations.first['path']).to eq(['areas', '*', 'tooltipImage'])
    end

    it 'finds reference in map with dynamic keys' do
      locations = FileReferenceLocations.new(ConfigurationSchemas.new([])).for(
        {'properties' => {
          'tooltipTexts' => {
            'type' => 'object',
            'additionalProperties' => {
              'properties' => {'image' => {'x-fileCollection' => 'image_files'}}
            }
          }
        }}
      )

      expect(locations.first['path']).to eq(['tooltipTexts', '*', 'image'])
    end

    it 'ignores additional properties that are not a schema' do
      locations = FileReferenceLocations.new(ConfigurationSchemas.new([])).for(
        {'properties' => {'texts' => {'type' => 'object', 'additionalProperties' => true}}}
      )

      expect(locations).to eq([])
    end

    it 'follows reference to defs of same document' do
      locations = FileReferenceLocations.new(ConfigurationSchemas.new([])).for(
        {'properties' => {'areas' => {'items' => {'$ref' => '#/$defs/area'}}},
         '$defs' => {
           'area' => {'properties' => {'image' => {'x-fileCollection' => 'image_files'}}}
         }}
      )

      expect(locations.first['path']).to eq(['areas', '*', 'image'])
    end

    it 'follows reference to other document' do
      schemas = ConfigurationSchemas.new(
        [{'$id' => 'pageflow-scrolled/common/position',
          'properties' => {'image' => {'x-fileCollection' => 'image_files'}}}]
      )

      locations = FileReferenceLocations.new(schemas).for(
        {'properties' => {'position' => {'$ref' => 'pageflow-scrolled/common/position'}}}
      )

      expect(locations.first['path']).to eq(%w[position image])
    end

    it 'follows reference to defs of other document' do
      schemas = ConfigurationSchemas.new(
        [{'$id' => 'pageflow-scrolled/common/link',
          '$defs' => {
            'target' => {'properties' => {'image' => {'x-fileCollection' => 'image_files'}}}
          }}]
      )

      locations = FileReferenceLocations.new(schemas).for(
        {'properties' => {'link' => {'$ref' => 'pageflow-scrolled/common/link#/$defs/target'}}}
      )

      expect(locations.first['path']).to eq(%w[link image])
    end

    it 'finds reference in branch of any of' do
      locations = FileReferenceLocations.new(ConfigurationSchemas.new([])).for(
        {'properties' => {
          'backdrop' => {
            'anyOf' => [
              {'properties' => {'image' => {'x-fileCollection' => 'image_files'}}}
            ]
          }
        }}
      )

      expect(locations)
        .to eq([{'path' => %w[backdrop image], 'collection' => 'imageFiles'}])
    end

    it 'finds references of all branches' do
      locations = FileReferenceLocations.new(ConfigurationSchemas.new([])).for(
        {'properties' => {
          'backdrop' => {
            'anyOf' => [
              {'properties' => {'image' => {'x-fileCollection' => 'image_files'}}},
              {'properties' => {'video' => {'x-fileCollection' => 'video_files'}}},
              {'properties' => {'color' => {'type' => 'string'}}}
            ]
          }
        }}
      )

      expect(locations.map { |location| location['path'] })
        .to contain_exactly(%w[backdrop image], %w[backdrop video])
    end

    it 'finds reference in branch of one of' do
      locations = FileReferenceLocations.new(ConfigurationSchemas.new([])).for(
        {'oneOf' => [
          {'properties' => {'image' => {'x-fileCollection' => 'image_files'}}}
        ]}
      )

      expect(locations.first['path']).to eq(['image'])
    end

    it 'follows reference from branch' do
      locations = FileReferenceLocations.new(ConfigurationSchemas.new([])).for(
        {'anyOf' => [{'$ref' => '#/$defs/imageBackdrop'}],
         '$defs' => {
           'imageBackdrop' => {
             'properties' => {'image' => {'x-fileCollection' => 'image_files'}}
           }
         }}
      )

      expect(locations.first['path']).to eq(['image'])
    end

    it 'follows same reference from two places' do
      locations = FileReferenceLocations.new(ConfigurationSchemas.new([])).for(
        {'properties' => {'area' => {'$ref' => '#/$defs/area'},
                          'portraitArea' => {'$ref' => '#/$defs/area'}},
         '$defs' => {
           'area' => {'properties' => {'image' => {'x-fileCollection' => 'image_files'}}}
         }}
      )

      expect(locations.map { |location| location['path'] })
        .to eq([%w[area image], %w[portraitArea image]])
    end

    it 'ignores unknown reference' do
      locations = FileReferenceLocations.new(ConfigurationSchemas.new([])).for(
        {'properties' => {'position' => {'$ref' => 'pageflow-scrolled/common/unknown'}}}
      )

      expect(locations).to eq([])
    end

    it 'does not loop on recursive reference' do
      locations = FileReferenceLocations.new(ConfigurationSchemas.new([])).for(
        {'properties' => {'area' => {'$ref' => '#/$defs/area'}},
         '$defs' => {
           'area' => {
             'properties' => {
               'image' => {'x-fileCollection' => 'image_files'},
               'nested' => {'$ref' => '#/$defs/area'}
             }
           }
         }}
      )

      expect(locations.map { |location| location['path'] }).to eq([%w[area image]])
    end
  end
end
