require 'spec_helper'

module Pageflow
  module Editor
    describe QuotasController do
      routes { Engine.routes }
      render_views

      describe '#show' do
        it 'responds with quota state and description' do
          user = create(:user)

          allow(Pageflow.config.quota).to receive(:exceeded?).with('entries', user.account).and_return(false)
          allow(Pageflow.config.quota).to receive(:state_description).with('entries', user.account).and_return('All is good')

          sign_in(user)
          get(:show, :id => 'entries', :format => 'json')

          expect(json_response(:path => :state)).to eq('ok')
          expect(json_response(:path => :state_description)).to eq('All is good')
        end

        it 'requires authentication' do
          get(:show, :id => 'entries', :format => 'json')

          expect(response.status).to eq(401)
        end
      end
    end
  end
end
