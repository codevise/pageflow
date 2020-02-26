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

        context 'files referenced', stub_paperclip: true do
          it 'ignores non file backdrops' do
            entry = SeedsDsl.sample_scrolled_entry(account: create(:account),
                                                   title: 'Example',
                                                   chapters: [
                                                     {
                                                       'sections' => [
                                                         {
                                                           'backdrop' => {'image' => '#fff'},
                                                           'foreground' => []
                                                         }
                                                       ]
                                                     }
                                                   ])
            image_values = Section.all_for_revision(entry.draft).map do |element|
              element.configuration.dig('backdrop', 'image')
            end

            expect(image_values).to eq(%w[#fff])
          end

          context 'image files referenced' do
            before do
              stub_request(:get, /example.com/)
                .to_return(status: 200,
                           body: File.read('spec/fixtures/image.jpg'),
                           headers: {'Content-Type' => 'image/jpg'})
            end

            it 'rewrites backdrop image and imageMobile to ids' do
              entry = SeedsDsl.sample_scrolled_entry(account: create(:account),
                                                     title: 'Example',
                                                     image_files: {
                                                       'some-image' => {
                                                         'url' => 'https://example.com/some.jpg'
                                                       }
                                                     },
                                                     chapters: [
                                                       {
                                                         'sections' => [
                                                           {
                                                             'backdrop' => {
                                                               'image' => 'some-image',
                                                               'imageMobile' => 'some-image'
                                                             },
                                                             'foreground' => []
                                                           }
                                                         ]
                                                       }
                                                     ])

              image_file = entry.draft.find_files(Pageflow::ImageFile).first

              expect(Section.all_for_revision(entry.draft).first.configuration)
                .to include('backdrop' => {
                  'image' => image_file.perma_id,
                  'imageMobile' => image_file.perma_id
                })
            end

            it 'rewrites inlineImage and stickyImage content elements' do
              entry = SeedsDsl.sample_scrolled_entry(account: create(:account),
                                                     title: 'Example',
                                                     image_files: {
                                                       'some-image' => {
                                                         'url' => 'https://example.com/some.jpg'
                                                       }
                                                     },
                                                     chapters: [
                                                       {
                                                         'sections' => [
                                                           {
                                                             'foreground' => [
                                                               {
                                                                 'type' => 'stickyImage',
                                                                 'props' => {
                                                                   'id' => 'some-image'
                                                                 }
                                                               }
                                                             ]
                                                           }
                                                         ]
                                                       }
                                                     ])

              image_file = entry.draft.find_files(Pageflow::ImageFile).first

              expect(ContentElement.all_for_revision(entry.draft).first.configuration)
                .to include('id' => image_file.perma_id)
            end
          end

          context 'video files referenced' do
            before do
              stub_request(:get, /example.com/)
                .to_return(status: 200,
                           body: File.read('spec/fixtures/video.mp4'),
                           headers: {'Content-Type' => 'video/mp4'})
            end

            it 'rewrites backdrop video to ids' do
              entry = SeedsDsl.sample_scrolled_entry(account: create(:account),
                                                     title: 'Example',
                                                     video_files: {
                                                       'some-video' => {
                                                         'url' => 'https://example.com/some.mp4'
                                                       }
                                                     },
                                                     chapters: [
                                                       {
                                                         'sections' => [
                                                           {
                                                             'backdrop' => {
                                                               'video' => 'some-video'
                                                             },
                                                             'foreground' => []
                                                           }
                                                         ]
                                                       }
                                                     ])

              video_file = entry.draft.find_files(Pageflow::VideoFile).first

              expect(Section.all_for_revision(entry.draft).first.configuration)
                .to include('backdrop' => {
                  'video' => video_file.perma_id
                })
            end

            it 'rewrites inlineVideo content elements' do
              entry = SeedsDsl.sample_scrolled_entry(account: create(:account),
                                                     title: 'Example',
                                                     video_files: {
                                                       'some-video' => {
                                                         'url' => 'https://example.com/some.mp4'
                                                       }
                                                     },
                                                     chapters: [
                                                       {
                                                         'sections' => [
                                                           {
                                                             'foreground' => [
                                                               {
                                                                 'type' => 'inlineVideo',
                                                                 'props' => {
                                                                   'id' => 'some-video'
                                                                 }
                                                               }
                                                             ]
                                                           }
                                                         ]
                                                       }
                                                     ])

              video_file = entry.draft.find_files(Pageflow::VideoFile).first

              expect(ContentElement.all_for_revision(entry.draft).first.configuration)
                .to include('id' => video_file.perma_id)
            end
          end
        end
      end

      context 'image files', stub_paperclip: true do
        before do
          stub_request(:get, /example.com/)
            .to_return(status: 200,
                       body: File.read('spec/fixtures/image.jpg'),
                       headers: {'Content-Type' => 'image/jpg'})
        end

        it 'creates image file' do
          entry = SeedsDsl.sample_scrolled_entry(account: create(:account),
                                                 title: 'Example',
                                                 image_files: {
                                                   'some-image' => {
                                                     'url' => 'https://example.com/some.jpg'
                                                   }
                                                 },
                                                 chapters: [])

          image_file = entry.draft.find_files(Pageflow::ImageFile).first

          expect(image_file.url).to include('some.JPG')
        end

        it 'stores configuration' do
          entry = SeedsDsl.sample_scrolled_entry(account: create(:account),
                                                 title: 'Example',
                                                 image_files: {
                                                   'some-image' => {
                                                     'url' => 'https://example.com/some.jpg',
                                                     'configuration' => {
                                                       'some' => 'value'
                                                     }
                                                   }
                                                 },
                                                 chapters: [])

          image_file = entry.draft.find_files(Pageflow::ImageFile).first

          expect(image_file.configuration).to eq('some' => 'value')
        end
      end

      context 'video files', stub_paperclip: true do
        before do
          stub_request(:get, /example.com/)
            .to_return(status: 200,
                       body: File.read('spec/fixtures/video.mp4'),
                       headers: {'Content-Type' => 'video/mp4'})
        end

        it 'creates video file' do
          entry = SeedsDsl.sample_scrolled_entry(account: create(:account),
                                                 title: 'Example',
                                                 video_files: {
                                                   'some-video' => {
                                                     'url' => 'https://example.com/some.mp4'
                                                   }
                                                 },
                                                 chapters: [])

          video_file = entry.draft.find_files(Pageflow::VideoFile).first

          expect(video_file.url).to include('some.mp4')
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
