require 'spec_helper'

module Pageflow
  describe EntriesController do
    routes { Engine.routes }
    render_views

    def main_app
      Rails.application.class.routes.url_helpers
    end

    describe 'atom feed' do
      before do
        create(:entry, :published, title: 'Atom-Powered Robots Run Amok')
      end

      it 'responds with success' do
        get(:index, format: 'atom')

        expect(response.status).to eq(200)
      end

      it 'responds with the correct mime type' do
        get(:index, format: 'atom')

        expect(response.content_type).to eq('application/atom+xml')
      end

      it 'responds with published entries' do
        get(:index, format: 'atom')

        expect(response.body).to include('<title>Atom-Powered Robots Run Amok</title>')
      end
    end
  end
end
