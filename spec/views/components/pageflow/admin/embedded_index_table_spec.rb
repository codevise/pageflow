require 'spec_helper'
require 'pageflow/shared_contexts/fake_translations'

module Pageflow
  describe Admin::EmbeddedIndexTable, type: :view_component do
    before do
      helper.extend(ActiveAdmin::ViewHelpers)
      allow(helper).to receive(:url_for)

      stub_active_admin_config
    end

    it 'renders table of entries' do
      create(:entry, title: 'Entry 1')
      create(:entry, title: 'Entry 2')

      render do
        embedded_index_table(Entry) do
          table_for_collection do
            column :title
          end
        end
      end

      expect(rendered).to have_selector('table tr td', text: 'Entry 1')
      expect(rendered).to have_selector('table tr td', text: 'Entry 2')
    end

    it 'supports filtering by scope' do
      create(:entry, :published, title: 'Published Entry')
      create(:entry, title: 'Other Entry')

      params[:scope] = 'published'

      render do
        embedded_index_table(Entry) do
          scope :all
          scope :published

          table_for_collection do
            column :title
          end
        end
      end

      expect(rendered).to have_selector('table td', text: 'Published Entry')
      expect(rendered).not_to have_selector('table td', text: 'Other Entry')
    end

    context 'translating scopes' do
      include_context 'fake translations'

      it 'respects resource-specific 18n-keys when translating scope filters' do
        translation(I18n.default_locale,
                    'active_admin.resources.Pageflow::Revision.scopes.publications',
                    'Specific Translation')

        entry = create(:entry, :published, title: 'Published Entry')

        render do
          embedded_index_table(entry.revisions, model: Revision) do
            scope :publications

            table_for_collection do
              column :frozen_at
            end
          end
        end

        expect(rendered).to have_selector('.scope.publications', text: 'Specific Translation')
      end

      it 'translates scope filters' do
        translation(I18n.default_locale,
                    'active_admin.scopes.some_scope',
                    'Published Tab Label')

        entry = create(:entry, :published, title: 'Published Entry')

        render do
          embedded_index_table(entry.revisions) do
            scope :some_scope, :publications

            table_for_collection do
              column :frozen_at
            end
          end
        end

        expect(rendered).to have_selector('.scope.some_scope', text: 'Published Tab Label')
      end
    end

    it 'can order by sort column' do
      create(:entry, title: 'Bbb')
      create(:entry, title: 'Aaa')

      params[:order] = 'title_asc'

      render do
        embedded_index_table(Entry) do
          table_for_collection sortable: true do
            column :id, sortable: true
            column :title, sortable: true
          end
        end
      end
      titles = Capybara.string(rendered).all('td:last-child').map(&:text)

      expect(titles).to eq(['Aaa', 'Bbb'])
    end

    it 'uses sort direction' do
      create(:entry, title: 'Bbb')
      create(:entry, title: 'Aaa')

      params[:order] = 'title_desc'

      render do
        embedded_index_table(Entry) do
          table_for_collection sortable: true do
            column :id, sortable: true
            column :title, sortable: true
          end
        end
      end
      titles = Capybara.string(rendered).all('td:last-child').map(&:text)

      expect(titles).to eq(['Bbb', 'Aaa'])
    end

    it 'sorts by first sortable column by default' do
      create(:entry, title: 'Aaa')
      create(:entry, title: 'Bbb')

      render do
        embedded_index_table(Entry.order('title DESC')) do
          table_for_collection sortable: true do
            column :id, sortable: false
            column :title, sortable: true
          end
        end
      end
      titles = Capybara.string(rendered).all('td:last-child').map(&:text)

      expect(titles).to eq(['Aaa', 'Bbb'])
    end

    it 'does not reorder if table is not sortable' do
      create(:entry, title: 'Bbb')
      create(:entry, title: 'Aaa')

      render do
        embedded_index_table(Entry.order('title DESC')) do
          table_for_collection do
            column :id, sortable: false
            column :title, sortable: true
          end
        end
      end
      titles = Capybara.string(rendered).all('td:last-child').map(&:text)

      expect(titles).to eq(['Bbb', 'Aaa'])
    end

    it 'ignores order parameter not matching sortable column' do
      create(:user, last_name: 'Aaa')
      create(:user, last_name: 'Bbb')

      params[:order] = 'last_name_desc'

      render do
        embedded_index_table(User) do
          table_for_collection sortable: true do
            column :last_name, sortable: false
          end
        end
      end
      titles = Capybara.string(rendered).all('td').map(&:text)

      expect(titles).to eq(['Aaa', 'Bbb'])
    end

    it 'ignores invalid order parameter' do
      create(:user, last_name: 'Bbb')
      create(:user, last_name: 'Aaa')

      params[:order] = 'not_there_desc'

      render do
        embedded_index_table(User) do
          table_for_collection sortable: true do
            column :last_name
          end
        end
      end
      titles = Capybara.string(rendered).all('td').map(&:text)

      expect(titles).to eq(['Aaa', 'Bbb'])
    end

    it 'uses column name passed to sortable option' do
      create(:user, last_name: 'Bobson', first_name: 'Bob')
      create(:user, last_name: 'Anderson', first_name: 'Andy')

      params[:order] = 'last_name_asc'

      render do
        embedded_index_table(User) do
          table_for_collection sortable: true do
            column :id, sortable: true
            column :formal_name, sortable: 'last_name'
          end
        end
      end
      titles = Capybara.string(rendered).all('td:last-child').map(&:text)

      expect(titles).to eq(['Anderson, Andy', 'Bobson, Bob'])
    end
  end
end
