require 'spec_helper'

module Pageflow
  describe React, type: :helper do
    describe '.create_widget_type' do
      it 'renders div with data-widget attribute' do
        widget_type = Pageflow::React.create_widget_type('some_loading_spinner',
                                                         'loading_spinner')
        entry = PublishedEntry.new(create(:entry, :published))

        html = widget_type.render(helper, entry)

        expect(html).to have_selector('[data-widget=some_loading_spinner]')
      end

      it 'supports server side rendering' do
        widget_type = Pageflow::React.create_widget_type('classic_loading_spinner',
                                                         'loading_spinner',
                                                         server_rendering: true)
        entry = PublishedEntry.new(create(:entry, :published))

        helper.extend(EntryJsonSeedHelper)
        html = widget_type.render(helper, entry)

        expect(html).to have_selector('.loading_spinner')
      end
    end
  end
end
