require 'spec_helper'

module PageflowScrolled
  RSpec.describe Seeds do
    module SeedsDsl
      extend Seeds
    end

    describe '#sample_scrolled_entry' do
      context 'entry' do
        it 'creates entry for account' do
          entry = SeedsDsl.sample_scrolled_entry(account: create(:account),
                                                 title: 'Example',
                                                 chapters: [])

          expect(entry).to be_persisted
        end

        it 'does not create entry if entry with same title exists for account' do
          account = create(:account)
          entry = create(:entry,
                         type_name: 'scrolled',
                         account: account,
                         title: 'Example')

          result = SeedsDsl.sample_scrolled_entry(account: account,
                                                  title: 'Example',
                                                  chapters: [])

          expect(result).to eq(entry)
        end
      end

      context 'entry structure' do
        it 'creates the main storyline' do
          entry = SeedsDsl.sample_scrolled_entry(account: create(:account),
                                                 title: 'Example',
                                                 chapters: [
                                                   {'title' => 'Chapter 1'}
                                                 ])

          expect(Storyline.all_for_revision(entry.draft).first).to be_present
        end

        it 'creates chapters as specified' do
          entry = SeedsDsl.sample_scrolled_entry(account: create(:account),
                                                 title: 'Example',
                                                 chapters: [
                                                   {'title' => 'Chapter 1'},
                                                   {'title' => 'Chapter 2'}
                                                 ])

          created_chapters = Chapter.all_for_revision(entry.draft)
          expect(created_chapters.count).to eq(2)
          expect(created_chapters.first.configuration['title']).to eq('Chapter 1')
          expect(created_chapters.last.configuration['title']).to eq('Chapter 2')
        end

        it 'creates sections as specified' do
          entry = SeedsDsl.sample_scrolled_entry(account: create(:account),
                                                 title: 'Example',
                                                 chapters: [
                                                   {
                                                     'title' => 'Chapter 1',
                                                     'sections' => [
                                                       {'transition' => 'scroll'},
                                                       {'transition' => 'fade'}
                                                     ]
                                                   }
                                                 ])

          created_sections = Section.all_for_revision(entry.draft)
          expect(created_sections.count).to eq(2)
          expect(created_sections.first.configuration['transition']).to eq('scroll')
          expect(created_sections.last.configuration['transition']).to eq('fade')
        end

        it 'creates the sections content_elements as specified' do
          entry = SeedsDsl.sample_scrolled_entry(account: create(:account),
                                                 title: 'Example',
                                                 chapters: [
                                                   {
                                                     'title' => 'Chapter 1',
                                                     'sections' => [
                                                       {
                                                         'transition' => 'scroll',
                                                         'foreground' => [
                                                           {
                                                             'type' => 'heading',
                                                             'props' => {
                                                               'children' => 'Pageflow Next'
                                                             }
                                                           }
                                                         ]
                                                       },
                                                       {
                                                         'transition' => 'fade',
                                                         'foreground' => [
                                                           {
                                                             'type' => 'textBlock',
                                                             'props' => {
                                                               'children' => 'Some content'
                                                             }
                                                           }
                                                         ]
                                                       }
                                                     ]
                                                   }
                                                 ])

          created_content_elements = ContentElement.all_for_revision(entry.draft)
          expect(created_content_elements.count).to eq(2)
          expect(created_content_elements.first.type_name).to eq('heading')
          expect(created_content_elements.first.configuration['children']).to eq('Pageflow Next')
          expect(created_content_elements.last.type_name).to eq('textBlock')
          expect(created_content_elements.last.configuration['children']).to eq('Some content')
        end
      end

      it 'allows overriding attributes in block' do
        account = create(:account)
        theming = create(:theming, account: account)

        entry = SeedsDsl.sample_scrolled_entry(account: account,
                                               title: 'Example',
                                               chapters: []) do |created_entry|
          created_entry.theming = theming
        end

        expect(entry.theming).to eq(theming)
      end
    end
  end
end
