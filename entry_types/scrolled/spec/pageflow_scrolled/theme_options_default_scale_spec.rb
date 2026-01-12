require 'spec_helper'

module PageflowScrolled
  RSpec.describe ThemeOptionsDefaultScale do
    it 'adds scale defaults if no scale properties defined' do
      transform = ThemeOptionsDefaultScale.new(
        prefix: 'section_padding_top',
        values: {'none' => '0', 'sm' => '1em'}
      )

      result = transform.call({})

      expect(result).to eq(
        properties: {
          root: {
            'section_padding_top-none' => '0',
            'section_padding_top-sm' => '1em'
          }
        }
      )
    end

    it 'preserves existing theme options' do
      transform = ThemeOptionsDefaultScale.new(
        prefix: 'section_padding_top',
        values: {'none' => '0', 'sm' => '1em'}
      )

      result = transform.call(colors: {accent: '#f00'})

      expect(result).to eq(
        colors: {accent: '#f00'},
        properties: {
          root: {
            'section_padding_top-none' => '0',
            'section_padding_top-sm' => '1em'
          }
        }
      )
    end

    it 'does not add defaults if theme defines any scale property' do
      transform = ThemeOptionsDefaultScale.new(
        prefix: 'section_padding_top',
        values: {'none' => '0', 'sm' => '1em', 'md' => '2em'}
      )

      result = transform.call(
        properties: {
          root: {
            'section_padding_top-lg' => '5em'
          }
        }
      )

      expect(result).to eq(
        properties: {
          root: {
            'section_padding_top-lg' => '5em'
          }
        }
      )
    end

    it 'adds defaults for one scale even if other scale is defined' do
      transform = ThemeOptionsDefaultScale.new(
        prefix: 'section_padding_top',
        values: {'none' => '0', 'sm' => '1em'}
      )

      result = transform.call(
        properties: {
          root: {
            'section_padding_bottom-lg' => '5em'
          }
        }
      )

      expect(result).to eq(
        properties: {
          root: {
            'section_padding_bottom-lg' => '5em',
            'section_padding_top-none' => '0',
            'section_padding_top-sm' => '1em'
          }
        }
      )
    end
  end
end
