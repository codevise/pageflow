require 'spec_helper'

module Pageflow
  describe PageType do
    describe '#export_version' do
      let(:page_type_class) do
        Class.new(PageType) do
          def initialize(options)
            @name = options.fetch(:name)
          end

          attr_reader :name
        end
      end

      it 'defaults to Pageflow plugin gem version' do
        stub_const('Pageflow::RainbowPage::VERSION', '2.1.3')
        page_type = page_type_class.new(name: 'rainbow_page')

        expect(page_type.export_version).to eq('2.1.3')
      end

      it 'falls back to gem version built using name as top level module' do
        stub_const('RainbowPage::VERSION', '2.1.3')
        page_type = page_type_class.new(name: 'rainbow_page')

        expect(page_type.export_version).to eq('2.1.3')
      end

      it 'raises helpful error when version constant can not be derived from name' do
        page_type = page_type_class.new(name: 'rainbow_page')

        expect {
          page_type.export_version
        }.to raise_error(/needs to define export_version/)
      end
    end
  end
end
