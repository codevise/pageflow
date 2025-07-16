require 'spec_helper'

require 'pageflow/global_config_api_test_helper'
require 'pageflow/entries_controller_test_helper'
require 'pageflow/test_widget_type'
require 'pageflow/test_page_type'

require 'pageflow/matchers/have_json_ld'
require 'pageflow/matchers/have_meta_tag'

require 'support/helpers/stub_template_controller_test_helper'

Pageflow::GlobalConfigApiTestHelper.setup

module PageflowPaged
  RSpec.describe EntriesController, type: :controller do
    include Pageflow::EntriesControllerTestHelper

    render_views

    describe '#show' do
      it 'sets first_page css class on first page' do
        entry = create(:entry, :published)
        create(:page, revision: entry.published_revision)
        create(:page, revision: entry.published_revision)

        get_with_entry_env(:show, entry:)

        expect(response.body).to have_selector('.first_page', count: 1)
      end

      it 'renders widgets at bottom of entry' do
        widget_type = Pageflow::TestWidgetType.new(name: 'test_widget',
                                                   rendered: '<div class="test_widget"></div>')

        pageflow_configure do |config|
          config.widget_types.register(widget_type)
        end

        entry = create(:entry, :published)
        create(:widget, subject: entry.published_revision, type_name: 'test_widget')

        get_with_entry_env(:show, entry:)

        expect(response.body).to have_selector('#outer_wrapper > div.test_widget')
      end

      it 'renders widgets at before_entry insert point' do
        widget_type = Pageflow::TestWidgetType.new(name: 'test_widget',
                                                   rendered: '<div class="test_widget"></div>',
                                                   insert_point: :before_entry)

        pageflow_configure do |config|
          config.widget_types.register(widget_type)
        end

        entry = create(:entry, :published)
        create(:widget, subject: entry.published_revision, type_name: 'test_widget')

        get_with_entry_env(:show, entry:)

        expect(response.body).to have_selector('body > div.test_widget')
      end

      it 'renders widgets which are disabled in editor and preview in published mode' do
        widget_type = Pageflow::TestWidgetType.new(name: 'test_widget',
                                                   enabled_in_editor: false,
                                                   enabled_in_preview: false,
                                                   rendered: '<div class="test_widget"></div>')

        pageflow_configure do |config|
          config.widget_types.register(widget_type)
        end

        entry = create(:entry, :published)
        create(:widget, subject: entry.published_revision, type_name: 'test_widget')

        get_with_entry_env(:show, entry:, mode: :published)

        expect(response.body).to have_selector('div.test_widget')
      end

      it 'does not prefix partial paths obtained from models' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowPaged.entry_type) do |c|
            c.page_types.register(Pageflow::TestPageType.new(name: 'test',
                                                             template_path: 'test/page'))
          end
        end

        stub_const('Rainbow::Record', Class.new { include ActiveModel::Conversion })
        stub_template('test/page.html.erb' => '<%= render Rainbow::Record.new %>')
        stub_template('rainbow/records/_record.html.erb' => '<div class="record"></div>')

        entry = create(:entry, :published)
        create(:page, revision: entry.published_revision, template: 'test')

        get_with_entry_env(:show, entry:, mode: :published)

        expect(response.body).to have_selector('div.record')
      end

      context 'in preview mode' do
        it 'renders widgets which are enabled in preview' do
          widget_type = Pageflow::TestWidgetType
                        .new(name: 'test_widget',
                             enabled_in_preview: true,
                             rendered_head_fragment: '<meta name="some_test" content="value">',
                             rendered: '<div class="test_widget"></div>')

          pageflow_configure do |config|
            config.widget_types.register(widget_type)
          end

          entry = create(:entry)
          create(:widget, subject: entry.draft, type_name: 'test_widget')

          get_with_entry_env(:show, entry:, mode: :preview)

          expect(response.body).to have_selector('div.test_widget')
          expect(response.body).to have_meta_tag.with_name('some_test')
        end

        it 'does not render widgets which are disabled in preview' do
          widget_type = Pageflow::TestWidgetType
                        .new(name: 'test_widget',
                             enabled_in_preview: false,
                             rendered_head_fragment: '<meta name="some_test" content="value">',
                             rendered: '<div class="test_widget"></div>')

          pageflow_configure do |config|
            config.widget_types.register(widget_type)
          end

          entry = create(:entry)
          create(:widget, subject: entry.draft, type_name: 'test_widget')

          get_with_entry_env(:show, entry:, mode: :preview)

          expect(response.body).not_to have_selector('div.test_widget')
        end
      end

      it 'renders widget\'s head fragments for entry' do
        widget_type = Pageflow::TestWidgetType
                      .new(name: 'test_widget',
                           rendered_head_fragment: '<meta name="some_test" content="value">')

        pageflow_configure do |config|
          config.widget_types.register(widget_type)
        end

        entry = create(:entry, :published)
        create(:widget, subject: entry.published_revision, type_name: 'test_widget')

        get_with_entry_env(:show, entry:)

        expect(response.body).to have_meta_tag.with_name('some_test')
      end

      it 'renders structured data for entry' do
        entry = create(:entry, :published)

        get_with_entry_env(:show, entry:)

        expect(response.body).to have_json_ld('@type' => 'Article')
      end

      it 'does not render structured data if feature is disabled' do
        entry = create(:entry, :published, without_feature: 'structured_data')

        get_with_entry_env(:show, entry:)

        expect(response.body).not_to have_json_ld('@type' => 'Article')
      end

      it 'renders feed link' do
        entry = create(:entry, :published)

        get_with_entry_env(:show, entry:)

        expect(response.body).to have_selector('link[type="application/atom+xml"]',
                                               visible: false)
      end

      it 'uses locale of entry' do
        entry = create(:entry, :published, published_revision_attributes: {locale: 'de'})

        get_with_entry_env(:show, entry:)

        expect(response.body).to have_selector('html[lang=de]')
      end

      context 'with page parameter' do
        it 'renders social sharing meta tags for page' do
          entry = create(:entry, :published)
          storyline = create(:storyline, revision: entry.published_revision)
          chapter = create(:chapter, storyline:)
          page = create(:page, configuration: {title: 'Shared page'}, chapter:)

          get_with_entry_env(:show, entry:, params: {page: page.perma_id})

          expect(response.body).to have_meta_tag
            .for_property('og:title')
            .with_content_including('Shared page')
        end

        it 'falls back to entry meta tags when page is missing' do
          entry = create(:entry,
                         :published,
                         published_revision_attributes: {title: 'Shared entry'})

          get_with_entry_env(:show, entry:, params: {page: 1234})

          expect(response.body).to have_meta_tag
            .for_property('og:title')
            .with_content_including('Shared entry')
        end
      end
    end
  end
end
