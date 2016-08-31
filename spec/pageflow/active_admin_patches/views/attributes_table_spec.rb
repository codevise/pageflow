require 'spec_helper'

module Pageflow
  module ActiveAdminPatches
    module Views
      describe AttributesTable, type: :view_component do
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

        describe '#boolean_status_tag_row' do
          it 'renders row with status_tag_row class' do
            record = model.new(true)

            render do
              attributes_table_for(record) do
                boolean_status_tag_row(:published?)
              end
            end

            expect(rendered).to have_selector('table tr.status_tag_row')
          end

          it 'renders status tag with state for true state' do
            record = model.new(true)

            render do
              attributes_table_for(record) do
                boolean_status_tag_row(:published?)
              end
            end

            expect(rendered).to have_selector('.status_tag.published.yes.warning')
          end

          it 'renders yes text inside status tag for true state' do
            record = model.new(true)

            render do
              attributes_table_for(record) do
                boolean_status_tag_row(:published?)
              end
            end

            expect(rendered).to have_selector('.status_tag',
                                              text: I18n.t('active_admin.status_tag.yes'))
          end

          it 'allows overriding type' do
            record = model.new(true)

            render do
              attributes_table_for(record) do
                boolean_status_tag_row(:published?, :ok)
              end
            end

            expect(rendered).to have_selector('.status_tag.published.yes.ok')
          end

          it 'renders dash for for false state' do
            record = model.new(false)

            render do
              attributes_table_for(record) do
                boolean_status_tag_row(:published?)
              end
            end

            expect(rendered).to have_selector('td', text: '-')
          end
        end
      end
    end
  end
end
