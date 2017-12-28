require 'spec_helper'

module Pageflow
  module Admin
    describe ExtensibleAttributesTable, type: :view_component do
      before do
        helper.extend(ActiveAdmin::ViewHelpers)
      end

      it 'renders same output as attributes_table by default' do
        entry = build(:entry)

        expected_html = render do
          attributes_table_for(entry) do
            row(:title)
            row(:updated_at, class: 'some_class')
          end
        end

        html = render do
          extensible_attributes_table_for(entry, []) do
            row(:title)
            row(:updated_at, class: 'some_class')
          end
        end

        expect(html).to eq(expected_html)
      end

      it 'allows appending rows' do
        entry = build(:entry)
        rows = AttributesTableRows.new

        rows.register(:entry, :created_at)

        html = render do
          extensible_attributes_table_for(entry, rows.for(:entry)) do
            row(:title)
            row(:updated_at)
          end
        end

        expected_html = render do
          attributes_table_for(entry) do
            row(:title)
            row(:updated_at)
            row(:created_at)
          end
        end

        expect(html).to eq(expected_html)
      end

      it 'allows adding rows with blocks' do
        entry = build_stubbed(:entry)
        rows = AttributesTableRows.new

        rows.register(:entry, :custom) { |e| e.created_at.utc }

        html = render do
          extensible_attributes_table_for(entry, rows.for(:entry)) do
            row(:title)
            row(:updated_at)
          end
        end

        expected_html = render do
          attributes_table_for(entry) do
            row(:title)
            row(:updated_at)
            row(:custom) { |e| e.created_at.utc }
          end
        end

        expect(html).to eq(expected_html)
      end

      it 'allows using arbre helpers in blocks' do
        entry = build_stubbed(:entry)
        rows = AttributesTableRows.new

        rows.register(:entry, :custom) { span 'custom' }

        html = render do
          extensible_attributes_table_for(entry, rows.for(:entry)) do
            row(:title)
            row(:updated_at)
          end
        end

        expected_html = render do
          attributes_table_for(entry) do
            row(:title)
            row(:updated_at)
            row(:custom) { span 'custom' }
          end
        end

        expect(html).to eq(expected_html)
      end

      it 'allows adding rows with custom block' do
        entry = build_stubbed(:entry)
        rows = AttributesTableRows.new

        rows.register(:entry, :custom, class: 'some_class')

        html = render do
          extensible_attributes_table_for(entry, rows.for(:entry)) do
            row(:title)
            row(:updated_at)
          end
        end

        expected_html = render do
          attributes_table_for(entry) do
            row(:title)
            row(:updated_at)
            row(:custom, class: 'some_class')
          end
        end

        expect(html).to eq(expected_html)
      end

      it 'allows inserting rows after certain existing rows' do
        entry = build_stubbed(:entry)
        rows = AttributesTableRows.new

        rows.register(:entry, :custom, after: :title)

        html = render do
          extensible_attributes_table_for(entry, rows.for(:entry)) do
            row(:title)
            row(:updated_at)
          end
        end

        expected_html = render do
          attributes_table_for(entry) do
            row(:title)
            row(:custom)
            row(:updated_at)
          end
        end

        expect(html).to eq(expected_html)
      end

      it 'allows inserting rows before certain existing rows' do
        entry = build_stubbed(:entry)
        rows = AttributesTableRows.new

        rows.register(:entry, :custom, before: :updated_at)

        html = render do
          extensible_attributes_table_for(entry, rows.for(:entry)) do
            row(:title)
            row(:updated_at)
          end
        end

        expected_html = render do
          attributes_table_for(entry) do
            row(:title)
            row(:custom)
            row(:updated_at)
          end
        end

        expect(html).to eq(expected_html)
      end

      it 'appends rows with unknown insert point at the end' do
        entry = build_stubbed(:entry)
        rows = AttributesTableRows.new

        rows.register(:entry, :custom, before: :not_there)
        rows.register(:entry, :other, after: :not_there)

        html = render do
          extensible_attributes_table_for(entry, rows.for(:entry)) do
            row(:title)
            row(:updated_at)
          end
        end

        expected_html = render do
          attributes_table_for(entry) do
            row(:title)
            row(:updated_at)
            row(:custom)
            row(:other)
          end
        end

        expect(html).to eq(expected_html)
      end

      it 'using other arbe builder methods works inside block' do
        entry = build_stubbed(:entry)
        rows = AttributesTableRows.new

        html = render do
          extensible_attributes_table_for(entry, rows.for(:entry)) do
            row(:title) { span('something') }
            row(:updated_at)
          end
        end

        expected_html = render do
          attributes_table_for(entry) do
            row(:title) { span('something') }
            row(:updated_at)
          end
        end

        expect(html).to eq(expected_html)
      end
    end
  end
end
