require 'spec_helper'

module PageflowScrolled
  RSpec.describe ReactWidgetType do
    it 'requires role and name option' do
      widget_type = ReactWidgetType.new(name: 'myFooter', role: 'footer')

      expect(widget_type.name).to eq('myFooter')
      expect(widget_type.roles).to eq(['footer'])
    end

    it 'enabled in editor by default' do
      widget_type = ReactWidgetType.new(name: 'myFooter', role: 'footer')

      expect(widget_type.enabled_in_editor?).to eq(true)
    end

    it 'can be disabled in editor' do
      widget_type = ReactWidgetType.new(name: 'myFooter',
                                        role: 'footer',
                                        enabled_in_editor: false)

      expect(widget_type.enabled_in_editor?).to eq(false)
    end
  end
end
