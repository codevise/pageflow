require 'spec_helper'

module Pageflow
  module ActiveAdminPatches
    module Views
      describe TableFor, type: :view_component do
        before do
          helper.extend(ActiveAdmin::ViewHelpers)
        end

        let(:model) do
          Class.new do
            def initialize(published)
              @published = published
            end

            def published?
              @published
            end

            def self.name
              'Model'
            end
          end
        end

        describe '#row_attributes' do
          it 'allows setting attributes on tr' do
            records = [model.new(true), model.new(false)]

            render do
              table_for(records) do
                row_attributes do |record|
                  {'data-published' => record.published? ? 'yes' : 'no'}
                end
                column :published?
              end
            end

            expect(rendered).to have_selector('tr[data-published=yes]')
            expect(rendered).to have_selector('tr[data-published=no]')
          end

          it 'merges class attribute' do
            records = [model.new(true), model.new(false)]

            render do
              table_for(records) do
                row_attributes do |record|
                  {class: record.published? ? 'published' : nil}
                end
                column :published?
              end
            end

            expect(rendered).to have_selector('tr.odd.published')
          end
        end

        describe '#boolean_status_tag_column' do
          it 'renders status tag with state for true state' do
            record = model.new(true)

            render do
              table_for([record]) do
                boolean_status_tag_column(:published?)
              end
            end

            expect(rendered).to have_selector('td .status_tag.published.yes.warning')
          end

          it 'renders yes text inside status text true state' do
            record = model.new(true)

            render do
              table_for([record]) do
                boolean_status_tag_column(:published?)
              end
            end

            expect(rendered).to have_selector('.status_tag',
                                              text: I18n.t('active_admin.status_tag.yes'))
          end

          it 'allows overriding type' do
            record = model.new(true)

            render do
              table_for([record]) do
                boolean_status_tag_column(:published?, :ok)
              end
            end

            expect(rendered).to have_selector('.status_tag.published.yes.ok')
          end

          it 'renders dash for for false state' do
            record = model.new(false)

            render do
              table_for([record]) do
                boolean_status_tag_column(:published?)
              end
            end

            expect(rendered).to have_selector('td', text: '-')
          end
        end
      end
    end
  end
end
