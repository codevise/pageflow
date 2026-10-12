require 'spec_helper'

module PageflowScrolled
  RSpec.describe EntryLinkReferences do
    it 'collects entry ids of signed links in slate trees' do
      configurations = [
        {
          'value' => [
            {
              'type' => 'paragraph',
              'children' => [
                {
                  'type' => 'link',
                  'href' => {'entry' => 7, 'signature' => EntryLinkSignature.generate(7)},
                  'children' => [{'text' => 'Link'}]
                }
              ]
            }
          ]
        }
      ]

      references = EntryLinkReferences.new(configurations)

      expect(references.entry_ids).to eq([7])
    end

    it 'collects links in keyed link objects' do
      configurations = [
        {
          'itemLinks' => {
            'item1' => {
              'href' => {'entry' => 7, 'signature' => EntryLinkSignature.generate(7)},
              'openInNewTab' => true
            },
            'item2' => {
              'href' => {'entry' => 8, 'signature' => EntryLinkSignature.generate(8)}
            }
          }
        }
      ]

      references = EntryLinkReferences.new(configurations)

      expect(references.entry_ids).to eq([7, 8])
    end

    it 'collects each entry id once' do
      configurations = [
        {'href' => {'entry' => 7, 'signature' => EntryLinkSignature.generate(7)}},
        {'href' => {'entry' => 7, 'signature' => EntryLinkSignature.generate(7)}}
      ]

      references = EntryLinkReferences.new(configurations)

      expect(references.entry_ids).to eq([7])
    end

    it 'ignores links with invalid signature' do
      configurations = [
        {
          'value' => [
            {'type' => 'link', 'href' => {'entry' => 7}},
            {'type' => 'link', 'href' => {'entry' => 8, 'signature' => 'forged'}},
            {
              'type' => 'link',
              'href' => {'entry' => 9, 'signature' => EntryLinkSignature.generate(10)}
            }
          ]
        }
      ]

      references = EntryLinkReferences.new(configurations)

      expect(references.entry_ids).to eq([])
    end

    it 'ignores links without entry' do
      configurations = [
        {
          'value' => [
            {'type' => 'link', 'href' => {'section' => 10}},
            {'type' => 'link', 'href' => {'chapter' => 3}},
            {'type' => 'link', 'href' => {'file' => {'permaId' => 5}}},
            {'type' => 'link', 'href' => 'https://example.com'}
          ]
        }
      ]

      references = EntryLinkReferences.new(configurations)

      expect(references.entry_ids).to eq([])
    end

    it 'ignores entry values that are not positive integers' do
      configurations = [
        {
          'value' => [
            {'type' => 'link', 'href' => {'entry' => 'other'}},
            {'type' => 'link', 'href' => {'entry' => 0}},
            {'type' => 'link', 'href' => {'entry' => nil}}
          ]
        }
      ]

      references = EntryLinkReferences.new(configurations)

      expect(references.entry_ids).to eq([])
    end

    it 'supports nil configurations' do
      references = EntryLinkReferences.new([nil])

      expect(references.entry_ids).to eq([])
    end
  end
end
