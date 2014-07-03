require 'spec_helper'

module Pageflow
  describe Configuration do

    class TestPageType < PageType
      name 'test'

      def initialize(*revision_components)
        @revision_components = revision_components
      end

      attr_reader :revision_components
    end

    describe '#revision_components' do
      it 'returns all RevisionComponents of registered PageTypes' do
        conf = Configuration.new
        conf.register_page_type(TestPageType.new(:component1))
        conf.register_page_type(TestPageType.new(:component2))

        expect(conf.revision_components).to eq([:component1, :component2])
      end

      it 'does not return duplicate RevisionComponents' do
        conf = Configuration.new
        conf.register_page_type(TestPageType.new(:component1))
        conf.register_page_type(TestPageType.new(:component1, :component2))

        expect(conf.revision_components).to eq([:component1, :component2])
      end
    end
  end
end
