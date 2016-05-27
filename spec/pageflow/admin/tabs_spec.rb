require 'spec_helper'

module Pageflow
  module Admin
    describe Tabs do
      describe '#find_by_resource' do
        it 'returns empty array for unknown resource' do
          tabs = Tabs.new
          entry = build(:entry)

          components = tabs.find_by_resource(entry)

          expect(components).to eq([])
        end

        it 'returns registered tabs for given resource' do
          tabs = Tabs.new
          entry = build(:entry)

          tabs.register(:entry, component: ViewComponent)
          tabs.register(:account, component: ViewComponent)
          components = tabs.find_by_resource(entry)

          expect(components.size).to eq(1)
          expect(components.first.component).to be(ViewComponent)
        end

        it 'passes given resource to tab objects' do
          tabs = Tabs.new
          entry = build(:entry)

          tabs.register(:entry, component: ViewComponent)
          components = tabs.find_by_resource(entry)

          expect(components.first.resource).to be(entry)
        end
      end
    end
  end
end
