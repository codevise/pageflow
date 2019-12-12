require 'spec_helper'

module Pageflow
  describe PartialEditorFragmentRenderer, type: :controller do
    render_views

    controller(Pageflow::Editor::EntriesController) do
      prepend_view_path ActionView::FixtureResolver
        .new('pageflow/editor/entries/_head.html.erb' =>
             '<script data-id="<%= entry.id %>"></script>',

             'pageflow/editor/entries/_body.html.erb' =>
              '<div data-id="<%= entry.id %>"></div>',

             'pageflow/editor/entries/_seed.json.jbuilder' =>
             'json.entry_id entry.id')
    end

    describe '#head_fragment' do
      it 'renders html partial passing entry' do
        renderer = PartialEditorFragmentRenderer.new(controller.class)
        entry = create(:entry)

        result = renderer.head_fragment(entry)

        expect(result).to eq(%(<script data-id="#{entry.id}"></script>))
      end
    end

    describe '#body_fragment' do
      it 'renders html partial passing entry' do
        renderer = PartialEditorFragmentRenderer.new(controller.class)
        entry = create(:entry)

        result = renderer.body_fragment(entry)

        expect(result).to eq(%(<div data-id="#{entry.id}"></div>))
      end
    end

    describe '#seed_fragment' do
      it 'renders html partial passing entry' do
        renderer = PartialEditorFragmentRenderer.new(controller.class)
        entry = create(:entry)

        result = JSON.parse(renderer.seed_fragment(entry))

        expect(result).to eq('entry_id' => entry.id)
      end
    end
  end
end
