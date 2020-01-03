require 'spec_helper'

require 'pageflow/entries_controller_test_helper'

module PageflowScrolled
  RSpec.describe EntriesController, type: :controller do
    include Pageflow::EntriesControllerTestHelper

    render_views

    describe '#show' do
      it 'renders script tag for frontend js' do
        entry = create(:entry, :published)
        create(:scrolled_chapter, revision: entry.published_revision)

        get_with_entry_env(:show, entry: entry)

        expect(response.body).to have_selector('script[src*=pageflow-scrolled-frontend]',
                                               visible: false)
      end
    end
  end
end
