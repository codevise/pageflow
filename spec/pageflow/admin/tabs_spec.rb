require 'spec_helper'

module Pageflow
  module Admin
    describe Tabs do
      describe '#find_by_resource' do
        it 'returns empty array for unknown resource' do
          tabs = Tabs.new

          components = tabs.find_by_resource(:unknown)

          expect(components).to eq([])
        end
      end

      describe '#register' do
        it 'allows to register multiple view components per resource' do
          tabs = Tabs.new

          tabs.register(:entry, component: ViewComponent)
          components = tabs.find_by_resource(:entry)

          expect(components).to eq([{component: ViewComponent}])
        end
      end
    end
  end
end
