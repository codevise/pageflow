require 'spec_helper'

module Pageflow
  describe PartialEditorFragmentRenderer, type: :controller do
    render_views

    controller(Pageflow::Editor::EntriesController) do
      prepend_view_path ActionView::FixtureResolver
        .new('pageflow/editor/entries/_head.html.erb' =>
             '<script data-id="<%= entry.id %>"></script>')
    end

    describe '#head_fragment' do
      it 'renders html partial passing entry' do
        renderer = PartialEditorFragmentRenderer.new(controller.class)
        entry = create(:entry)

        result = renderer.head_fragment(entry)

        expect(result).to eq(%(<script data-id="#{entry.id}"></script>))
      end
    end
  end
end
