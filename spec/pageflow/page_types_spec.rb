require 'spec_helper'

module Pageflow
  describe PageTypes do
    let(:page_type_class) do
      Class.new(PageType) do
        def initialize(options)
          @name = options.fetch(:name)
        end

        attr_reader :name
      end
    end

    describe '#find_by_name!' do
      it 'returns page type with given name' do
        page_types = PageTypes.new
        page_type = page_type_class.new(name: 'test')

        page_types.register(page_type)
        result = page_types.find_by_name!('test')

        expect(result).to be(page_type)
      end

      it 'raises helpful error if page type is not found' do
        page_types = PageTypes.new

        expect {
          page_types.find_by_name!('not_there')
        }.to raise_error(/Unknown page type/)
      end
    end

    describe '#names' do
      it 'returns names of registed page types' do
        page_types = PageTypes.new
        page_type = page_type_class.new(name: 'test')

        page_types.register(page_type)
        result = page_types.names

        expect(result).to eq(['test'])
      end
    end

    describe '#each' do
      it 'makes object enumarable' do
        page_types = PageTypes.new
        page_type = page_type_class.new(name: 'test')

        page_types.register(page_type)
        result = page_types.first

        expect(result).to be(page_type)
      end
    end
  end
end
