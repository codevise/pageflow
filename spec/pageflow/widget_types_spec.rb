require 'spec_helper'

module Pageflow
  describe WidgetTypes do
    before do
      Pageflow.config.widget_types.clear
    end

    describe '#roles' do
      it 'returns uniq list of roles' do
        widget_types = WidgetTypes.new
        widget_types.register(TestWidgetType.new(name: 'some_navigation', roles: ['navigation']))
        widget_types.register(TestWidgetType.new(name: 'some_header',
                                                 roles: [
                                                   'navigation', 'header'
                                                 ]))

        expect(widget_types.roles).to eq(['navigation', 'header'])
      end
    end

    describe '#defaults_by_role' do
      it 'returns default widget type for role' do
        widget_types = WidgetTypes.new
        widget_types.register(TestWidgetType.new(name: 'some_navigation', roles: ['navigation']),
                              default: true)

        expect(widget_types.defaults_by_role['navigation'].name).to eq('some_navigation')
      end
    end
  end
end
