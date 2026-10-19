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

    describe '#chapter_perma_ids' do
      it 'collects perma ids of signed chapter links per entry' do
        configurations = [
          {'href' => chapter_href(7, 10)},
          {'href' => chapter_href(7, 11)},
          {'href' => chapter_href(7, 10)},
          {'href' => chapter_href(8, 12)}
        ]

        references = EntryLinkReferences.new(configurations)

        expect(references.chapter_perma_ids(7)).to eq([10, 11])
        expect(references.entry_ids).to eq([7, 8])
      end

      it 'ignores chapter links signed for entry only' do
        configurations = [
          {'href' => {'entry' => 7, 'chapter' => 10,
                      'signature' => EntryLinkSignature.generate(7)}}
        ]

        references = EntryLinkReferences.new(configurations)

        expect(references.chapter_perma_ids(7)).to eq([])
        expect(references.entry_ids).to eq([])
      end

      it 'returns empty array for entry without chapter links' do
        references = EntryLinkReferences.new([])

        expect(references.chapter_perma_ids(7)).to eq([])
      end
    end

    describe '#section_perma_ids' do
      it 'collects perma ids of signed section links per entry' do
        configurations = [
          {'href' => {'entry' => 7, 'section' => 20,
                      'signature' => EntryLinkSignature.generate(7, section: 20)}}
        ]

        references = EntryLinkReferences.new(configurations)

        expect(references.section_perma_ids(7)).to eq([20])
      end

      it 'ignores section links with signature of chapter' do
        configurations = [
          {'href' => {'entry' => 7, 'section' => 20,
                      'signature' => EntryLinkSignature.generate(7, chapter: 20)}}
        ]

        references = EntryLinkReferences.new(configurations)

        expect(references.section_perma_ids(7)).to eq([])
      end
    end

    def chapter_href(entry_id, chapter_perma_id)
      {'entry' => entry_id,
       'chapter' => chapter_perma_id,
       'signature' => EntryLinkSignature.generate(entry_id, chapter: chapter_perma_id)}
    end
  end
end
