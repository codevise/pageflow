require 'spec_helper'

module Pageflow
  module Admin
    describe EmbedCodeField, type: :view_component do
      it 'renders a text field with the given name' do
        snippet = -> { '<iframe />' }

        render(snippet, name: 'some_embed')

        expect(rendered).to have_selector('input[name=some_embed]')
      end

      it 'renders a text field with the html snippet' do
        snippet = -> { '<iframe />' }

        render(snippet, name: 'some_embed')

        expect(rendered).to have_selector("input[value='<iframe />']")
      end

      it 'can render a hint' do
        snippet = -> { '<iframe />' }

        render(snippet, name: 'some_embed', hint: 'a hint')

        expect(rendered).to have_selector('p', text: 'a hint')
      end
    end
  end
end
