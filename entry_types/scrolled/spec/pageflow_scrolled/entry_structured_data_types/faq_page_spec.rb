require 'spec_helper'

module PageflowScrolled
  module EntryStructuredDataTypes
    RSpec.describe FaqPage do
      describe '#call' do
        it 'generates FAQPage structured data from question content elements' do
          published_entry = create(:published_entry)
          create(:content_element,
                 revision: published_entry.revision,
                 type_name: 'question',
                 configuration: {
                   'question' => [
                     {'type' => 'paragraph', 'children' => [{'text' => 'What is Pageflow?'}]}
                   ],
                   'answer' => [
                     {'type' => 'paragraph', 'children' => [{'text' => 'A storytelling platform.'}]}
                   ]
                 })

          faq_page = FaqPage.new
          result = faq_page.call(published_entry)

          expect(result).to eq(
            '@type' => 'FAQPage',
            'mainEntity' => [
              {
                '@type' => 'Question',
                'name' => 'What is Pageflow?',
                'acceptedAnswer' => {
                  '@type' => 'Answer',
                  'text' => 'A storytelling platform.'
                }
              }
            ]
          )
        end

        it 'handles multiple question elements' do
          published_entry = create(:published_entry)
          create(:content_element,
                 revision: published_entry.revision,
                 type_name: 'question',
                 configuration: {
                   'question' => [
                     {'type' => 'paragraph', 'children' => [{'text' => 'First question?'}]}
                   ],
                   'answer' => [
                     {'type' => 'paragraph', 'children' => [{'text' => 'First answer.'}]}
                   ]
                 })
          create(:content_element,
                 revision: published_entry.revision,
                 type_name: 'question',
                 configuration: {
                   'question' => [
                     {'type' => 'paragraph', 'children' => [{'text' => 'Second question?'}]}
                   ],
                   'answer' => [
                     {'type' => 'paragraph', 'children' => [{'text' => 'Second answer.'}]}
                   ]
                 })

          faq_page = FaqPage.new
          result = faq_page.call(published_entry)

          expect(result['mainEntity'].length).to eq(2)
          expect(result['mainEntity'][0]['name']).to eq('First question?')
          expect(result['mainEntity'][1]['name']).to eq('Second question?')
        end

        it 'extracts text from complex nested Slate.js structures' do
          published_entry = create(:published_entry)
          create(:content_element,
                 revision: published_entry.revision,
                 type_name: 'question',
                 configuration: {
                   'question' => [
                     {
                       'type' => 'paragraph',
                       'children' => [
                         {'text' => 'What is '},
                         {'text' => 'Pageflow', 'bold' => true},
                         {'text' => '?'}
                       ]
                     }
                   ],
                   'answer' => [
                     {
                       'type' => 'paragraph',
                       'children' => [{'text' => 'It is a '}]
                     },
                     {
                       'type' => 'paragraph',
                       'children' => [
                         {'text' => 'storytelling platform'},
                         {'text' => ' with '},
                         {
                           'type' => 'link',
                           'href' => 'https://example.com',
                           'children' => [{'text' => 'great features'}]
                         },
                         {'text' => '.'}
                       ]
                     }
                   ]
                 })

          faq_page = FaqPage.new
          result = faq_page.call(published_entry)

          expect(result['mainEntity'][0]['name']).to eq('What is Pageflow?')
          expect(result['mainEntity'][0]['acceptedAnswer']['text'])
            .to eq('It is a storytelling platform with great features.')
        end

        it 'filters out questions with blank question text' do
          published_entry = create(:published_entry)
          create(:content_element,
                 revision: published_entry.revision,
                 type_name: 'question',
                 configuration: {
                   'question' => [],
                   'answer' => [
                     {'type' => 'paragraph', 'children' => [{'text' => 'An answer.'}]}
                   ]
                 })

          faq_page = FaqPage.new
          result = faq_page.call(published_entry)

          expect(result['mainEntity']).to be_empty
        end

        it 'filters out questions with blank answer text' do
          published_entry = create(:published_entry)
          create(:content_element,
                 revision: published_entry.revision,
                 type_name: 'question',
                 configuration: {
                   'question' => [
                     {'type' => 'paragraph', 'children' => [{'text' => 'A question?'}]}
                   ],
                   'answer' => []
                 })

          faq_page = FaqPage.new
          result = faq_page.call(published_entry)

          expect(result['mainEntity']).to be_empty
        end

        it 'handles missing question configuration' do
          published_entry = create(:published_entry)
          create(:content_element,
                 revision: published_entry.revision,
                 type_name: 'question',
                 configuration: {
                   'answer' => [
                     {'type' => 'paragraph', 'children' => [{'text' => 'An answer.'}]}
                   ]
                 })

          faq_page = FaqPage.new
          result = faq_page.call(published_entry)

          expect(result['mainEntity']).to be_empty
        end

        it 'handles missing answer configuration' do
          published_entry = create(:published_entry)
          create(:content_element,
                 revision: published_entry.revision,
                 type_name: 'question',
                 configuration: {
                   'question' => [
                     {'type' => 'paragraph', 'children' => [{'text' => 'A question?'}]}
                   ]
                 })

          faq_page = FaqPage.new
          result = faq_page.call(published_entry)

          expect(result['mainEntity']).to be_empty
        end

        it 'returns empty mainEntity when no question content elements exist' do
          published_entry = create(:published_entry)

          faq_page = FaqPage.new
          result = faq_page.call(published_entry)

          expect(result).to eq(
            '@type' => 'FAQPage',
            'mainEntity' => []
          )
        end

        it 'can be configured with custom content element type names' do
          published_entry = create(:published_entry)
          create(:content_element,
                 revision: published_entry.revision,
                 type_name: 'customQuestion',
                 configuration: {
                   'question' => [
                     {'type' => 'paragraph', 'children' => [{'text' => 'Custom question?'}]}
                   ],
                   'answer' => [
                     {'type' => 'paragraph', 'children' => [{'text' => 'Custom answer.'}]}
                   ]
                 })

          faq_page = FaqPage.new(content_element_type_names: ['customQuestion'])
          result = faq_page.call(published_entry)

          expect(result['mainEntity'].length).to eq(1)
          expect(result['mainEntity'][0]['name']).to eq('Custom question?')
        end

        it 'supports multiple content element type names' do
          published_entry = create(:published_entry)
          create(:content_element,
                 revision: published_entry.revision,
                 type_name: 'question',
                 configuration: {
                   'question' => [
                     {'type' => 'paragraph', 'children' => [{'text' => 'Standard question?'}]}
                   ],
                   'answer' => [
                     {'type' => 'paragraph', 'children' => [{'text' => 'Standard answer.'}]}
                   ]
                 })
          create(:content_element,
                 revision: published_entry.revision,
                 type_name: 'faq',
                 configuration: {
                   'question' => [
                     {'type' => 'paragraph', 'children' => [{'text' => 'FAQ question?'}]}
                   ],
                   'answer' => [
                     {'type' => 'paragraph', 'children' => [{'text' => 'FAQ answer.'}]}
                   ]
                 })

          faq_page = FaqPage.new(content_element_type_names: ['question', 'faq'])
          result = faq_page.call(published_entry)

          expect(result['mainEntity'].length).to eq(2)
        end

        it 'ignores content elements of other types' do
          published_entry = create(:published_entry)
          create(:content_element,
                 revision: published_entry.revision,
                 type_name: 'textBlock',
                 configuration: {
                   'children' => [
                     {'type' => 'paragraph', 'children' => [{'text' => 'Some text'}]}
                   ]
                 })

          faq_page = FaqPage.new
          result = faq_page.call(published_entry)

          expect(result['mainEntity']).to be_empty
        end
      end
    end
  end
end
