require 'spec_helper'

module Pageflow
  describe PagesHelper do
    include UsedFileTestHelper

    describe '#render_page_template' do
      it 'renders page template given by page type' do
        page_type = TestPageType.new(name: 'test', template_path: 'pageflow/test/page')
        Pageflow.config.page_types.register(page_type)
        page = build(:page, template: 'test')

        stub_template('pageflow/test/page.html.erb' => '<div>test page</div>')
        result = helper.render_page_template(page)

        expect(result).to include('<div>test page</div>')
      end

      it 'passes configuration as local' do
        page_type = TestPageType.new(name: 'test', template_path: 'pageflow/test/page')
        Pageflow.config.page_types.register(page_type)
        page = build(:page, template: 'test', configuration: {
                       'text' => 'Some text'
                     })

        stub_template('pageflow/test/page.html.erb' => '<%= configuration["text"] %>')
        result = helper.render_page_template(page)

        expect(result).to include('Some text')
      end

      it 'passes page as local' do
        page_type = TestPageType.new(name: 'test', template_path: 'pageflow/test/page')
        Pageflow.config.page_types.register(page_type)
        page = build(:page, template: 'test')

        stub_template('pageflow/test/page.html.erb' => 'Page <%= page.template %>')
        result = helper.render_page_template(page)

        expect(result).to include('Page test')
      end

      it 'passes additional locals' do
        page_type = TestPageType.new(name: 'test', template_path: 'pageflow/test/page')
        Pageflow.config.page_types.register(page_type)
        page = build(:page, template: 'test')

        stub_template('pageflow/test/page.html.erb' => 'Page <%= some %>')
        result = helper.render_page_template(page, some: 'test')

        expect(result).to include('Page test')
      end
    end

    describe '#page_css_class' do
      it 'contains invert class if invert configuration option is present' do
        page = build(:page, configuration: {'invert' => true})

        css_classes = helper.page_css_class(page).split(' ')

        expect(css_classes).to include('page')
        expect(css_classes).to include('invert')
      end

      it 'contains invert class if hide_title configuration option is present' do
        page = build(:page, configuration: {'hide_title' => true})

        css_classes = helper.page_css_class(page).split(' ')

        expect(css_classes).to include('page')
        expect(css_classes).to include('hide_title')
      end

      it 'contains text_position_right class if text_position is right' do
        page = build(:page, configuration: {'text_position' => 'right'})

        css_classes = helper.page_css_class(page).split(' ')

        expect(css_classes).to include('page')
        expect(css_classes).to include('text_position_right')
      end

      it 'does not contain first_page class by default' do
        page = build(:page)

        css_classes = helper.page_css_class(page).split(' ')

        expect(css_classes).not_to include('first_page')
      end

      it 'contains first_page class if page has is_first attribute set' do
        page = build(:page, is_first: true)

        css_classes = helper.page_css_class(page).split(' ')

        expect(css_classes).to include('first_page')
      end
    end

    describe '#page_thumbnail_image_class' do
      before { helper.extend(FileThumbnailsHelper) }

      it 'returns file_thumbnail_css_class of thumbnail_file of page' do
        image_file = create_used_file(:image_file)
        page = build(:page,
                     template: 'background_image',
                     configuration: {'thumbnail_image_id' => image_file.perma_id})

        css_class = helper.page_thumbnail_image_class(page, false)

        expect(css_class).to eq("pageflow_image_file_link_thumbnail_#{image_file.perma_id}")
      end

      it 'returns large variant for hero' do
        image_file = create_used_file(:image_file)
        page = build(:page,
                     template: 'background_image',
                     configuration: {'thumbnail_image_id' => image_file.perma_id})

        css_class = helper.page_thumbnail_image_class(page, true)

        expect(css_class).to eq("pageflow_image_file_link_thumbnail_large_#{image_file.perma_id}")
      end
    end

    describe '#page_thumbnail_file' do
      it 'returns the thumbnail file configured for the page' do
        image_file = create_used_file(:image_file)
        page = build(:page,
                     template: 'background_image',
                     configuration: {'thumbnail_image_id' => image_file.perma_id})

        thumbnail_file = helper.page_thumbnail_file(page)
        expect(thumbnail_file).to eq(image_file)
      end
    end

    describe '#page_default_content' do
      before { helper.extend(BackgroundImageHelper) }

      it 'renders header, print image and page text' do
        image_file = create_used_file(:image_file)

        page = build(:page, configuration: {
                       'background_image_id' => image_file.perma_id,
                       'title' => 'Title',
                       'tagline' => 'Tagline',
                       'subtitle' => 'Subtitle'
                     })

        html = helper.page_default_content(page)

        expect(html).to have_selector('.page_header')
        expect(html).to have_selector('.print_image')
        expect(html).to have_selector('.page_text')
      end
    end

    describe '#page_header' do
      it 'renders h3 tag with tagline, title and subtitle' do
        page = build(:page, configuration: {
                       'title' => 'Title',
                       'tagline' => 'Tagline',
                       'subtitle' => 'Subtitle'
                     })

        html = helper.page_header(page)

        expect(html).to have_selector('h3.page_header')
        expect(html).to have_selector('.page_header-tagline', text: 'Tagline')
        expect(html).to have_selector('.page_header-title', text: 'Title')
        expect(html).to have_selector('.page_header-subtitle', text: 'Subtitle')
      end
    end

    describe '#page_print_image' do
      before { helper.extend(BackgroundImageHelper) }

      it 'renders img tag' do
        image_file = create_used_file(:image_file)
        page = build(:page, configuration: {
                       'background_image_id' => image_file.perma_id
                     })

        html = helper.page_print_image(page)

        expect(html).to have_selector('img.print_image')
      end
    end

    describe '#page_text' do
      it 'renders content_text div with html content' do
        page = build(:page, configuration: {'text' => '<b>Text</b>'})

        html = helper.page_text(page)

        expect(html).to have_selector('.page_text .paragraph b', text: 'Text')
      end
    end
  end
end
