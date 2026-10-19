require 'spec_helper'

module PageflowScrolled
  RSpec.describe EntryLinkReferences do
    describe '#chapter_perma_ids_by_entry_id' do
      it 'returns ids of entries of signed links in slate trees' do
        configurations = [
          {
            'value' => [
              {
                'type' => 'paragraph',
                'children' => [
                  {'type' => 'link', 'href' => entry_href(5), 'children' => [{'text' => 'L'}]}
                ]
              }
            ]
          }
        ]

        result = EntryLinkReferences.new(configurations).chapter_perma_ids_by_entry_id

        expect(result).to eq(5 => [])
      end

      it 'collects links in keyed link objects' do
        configurations = [
          {
            'itemLinks' => {
              'item1' => {'href' => entry_href(5), 'openInNewTab' => true},
              'item2' => {'href' => entry_href(6)}
            }
          }
        ]

        result = EntryLinkReferences.new(configurations).chapter_perma_ids_by_entry_id

        expect(result).to eq(5 => [], 6 => [])
      end

      it 'ignores links with invalid signature' do
        configurations = [
          {'href' => {'entry' => 5}},
          {'href' => {'entry' => 6, 'signature' => 'forged'}},
          {'href' => {'entry' => 7, 'signature' => EntryLinkSignature.generate(5)}}
        ]

        result = EntryLinkReferences.new(configurations).chapter_perma_ids_by_entry_id

        expect(result).to eq({})
      end

      it 'ignores links without entry and invalid entry values' do
        configurations = [
          {
            'value' => [
              {'type' => 'link', 'href' => {'section' => 10}},
              {'type' => 'link', 'href' => {'file' => {'permaId' => 5}}},
              {'type' => 'link', 'href' => 'https://example.com'},
              {'type' => 'link', 'href' => {'entry' => 'other'}},
              {'type' => 'link', 'href' => {'entry' => 0}}
            ]
          },
          nil
        ]

        result = EntryLinkReferences.new(configurations).chapter_perma_ids_by_entry_id

        expect(result).to eq({})
      end

      it 'returns perma ids of signed chapter links once' do
        configurations = [
          {'href' => chapter_href(5, 20)},
          {'href' => chapter_href(5, 20)},
          {'href' => {'entry' => 5,
                      'section' => 30,
                      'signature' => EntryLinkSignature.generate(5, section: 30)}}
        ]

        result = EntryLinkReferences.new(configurations).chapter_perma_ids_by_entry_id

        expect(result).to eq(5 => [20])
      end

      it 'includes entries of section links' do
        configurations = [
          {'href' => {'entry' => 5,
                      'section' => 30,
                      'signature' => EntryLinkSignature.generate(5, section: 30)}}
        ]

        result = EntryLinkReferences.new(configurations).chapter_perma_ids_by_entry_id

        expect(result).to eq(5 => [])
      end

      it 'ignores chapter links signed for entry only' do
        configurations = [
          {'href' => {'entry' => 5, 'chapter' => 10,
                      'signature' => EntryLinkSignature.generate(5)}}
        ]

        result = EntryLinkReferences.new(configurations).chapter_perma_ids_by_entry_id

        expect(result).to eq({})
      end
    end

    def entry_href(entry_id)
      {'entry' => entry_id, 'signature' => EntryLinkSignature.generate(entry_id)}
    end

    def chapter_href(entry_id, chapter_perma_id)
      {'entry' => entry_id,
       'chapter' => chapter_perma_id,
       'signature' => EntryLinkSignature.generate(entry_id, chapter: chapter_perma_id)}
    end
  end
end
