require 'spec_helper'

module Pageflow
  module Admin
    describe TabsView, type: :view_component do
      let(:tab_view_component) do
        Class.new(ViewComponent) do
          def self.name
            'TabViewComponent'
          end
        end
      end

      let(:other_tab_view_component) do
        Class.new(ViewComponent) do
          def self.name
            'OtherTabViewComponent'
          end
        end
      end

      it 'renders tab links' do
        tabs = [Tab.new(name: :some_tab, component: tab_view_component)]

        render(tabs)

        expect(rendered).to have_selector('.admin_tabs_view ul.admin_tabs_view-tabs li.some_tab a')
      end

      it 'filters query parameters in tab link' do
        tabs = [
          Tab.new(name: :some_tab, component: tab_view_component),
          Tab.new(name: :other_tab, component: other_tab_view_component)
        ]

        controller.request.query_parameters.merge!(page: '2', scope: 'active', other: 'kept')
        render(tabs)

        expect(rendered).to have_selector('a[href="?other=kept&tab=some_tab"]')
      end

      it 'renders first tab component as active by default' do
        tabs = [Tab.new(name: :some_tab, component: tab_view_component)]

        render(tabs)

        expect(rendered).to have_selector('.admin_tabs_view-container.active .tab_view_component')
      end

      it 'renders tab from tab param as active' do
        tabs = [
          Tab.new(name: :some_tab, component: tab_view_component),
          Tab.new(name: :other_tab, component: other_tab_view_component)
        ]

        controller.request.params.merge!(tab: 'other_tab')
        render(tabs)

        expect(rendered)
          .to have_selector('.admin_tabs_view-container.active .other_tab_view_component')
      end

      it 'renders current tab component as active' do
        tabs = [
          Tab.new(name: :some_tab, component: tab_view_component),
          Tab.new(name: :other_tab, component: other_tab_view_component)
        ]

        render(tabs, current_tab: :other_tab)

        expect(rendered)
          .to have_selector('.admin_tabs_view-container.active .other_tab_view_component')
      end

      it 'also renders inactive tabs' do
        tabs = [
          Tab.new(name: :some_tab, component: tab_view_component),
          Tab.new(name: :other_tab, component: other_tab_view_component)
        ]

        render(tabs, current_tab: :other_tab)

        expect(rendered).to have_selector('.admin_tabs_view-container .tab_view_component')
      end

      it 'allows passing arguments to tab view component build method' do
        tab_view_component_with_params = Class.new(tab_view_component) do
          def build(custom)
            super('data-custom' => custom)
          end
        end
        tabs = [Tab.new(name: :some_tab, component: tab_view_component_with_params)]

        render(tabs, build_args: ['custom'])

        expect(rendered)
          .to have_selector('.admin_tabs_view-container .tab_view_component[data-custom="custom"]')
      end

      context 'with :authorize options' do
        it 'does not render links for tabs we are not authorized for' do
          tabs = [Tab.new(name: :some_tab, component: tab_view_component)]

          allow(helper).to receive(:authorized?) { false }

          render(tabs, authorize: :see_some_tab)

          expect(rendered).not_to have_selector('ul.admin_tabs_view-tabs li.some_tab a')
        end

        it 'renders links for tabs we are authorized for' do
          tabs = [Tab.new(name: :some_tab, component: tab_view_component)]

          allow(helper).to receive(:authorized?) { true }

          render(tabs, authorize: :see_some_tab)

          expect(rendered).to have_selector('ul.admin_tabs_view-tabs li.some_tab a')
        end

        it 'passes :view action and component class to authorized? method' do
          tabs = [Tab.new(name: :some_tab, component: tab_view_component)]

          allow(helper).to receive(:authorized?) { true }

          render(tabs, authorize: :see_some_tab)

          expect(helper).to have_received(:authorized?).with(:see_some_tab, tabs.first)
        end
      end
    end
  end
end
