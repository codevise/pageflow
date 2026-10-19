require 'spec_helper'

module PageflowScrolled
  RSpec.describe ConfigurationHrefs do
    it 'yields hrefs of slate link nodes with paths of their nodes' do
      configuration = {
        'value' => [
          {'type' => 'paragraph', 'children' => [
            {'type' => 'link', 'href' => {'entry' => 7}, 'children' => [{'text' => 'Link'}]}
          ]}
        ]
      }

      expect { |block| ConfigurationHrefs.each(configuration, &block) }
        .to yield_with_args({'entry' => 7}, ['value', 0, 'children', 0])
    end

    it 'yields hrefs of keyed link objects' do
      configuration = {
        'itemLinks' => {'item1' => {'href' => {'file' => {'permaId' => 5}}}}
      }

      expect { |block| ConfigurationHrefs.each(configuration, &block) }
        .to yield_with_args({'file' => {'permaId' => 5}}, %w[itemLinks item1])
    end

    it 'yields hrefs nested inside objects that have an href themselves' do
      configuration = {
        'href' => {'entry' => 7},
        'items' => [{'href' => {'entry' => 8}}]
      }

      expect { |block| ConfigurationHrefs.each(configuration, &block) }
        .to yield_successive_args([{'entry' => 7}, []], [{'entry' => 8}, ['items', 0]])
    end

    it 'ignores hrefs that are not objects' do
      configuration = {'value' => [nil, {'href' => 'https://example.com'}, {'href' => nil}]}

      expect { |block| ConfigurationHrefs.each(configuration, &block) }.not_to yield_control
    end
  end
end
