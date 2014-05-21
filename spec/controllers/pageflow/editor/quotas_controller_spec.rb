require 'spec_helper'

module Pageflow
  module Editor
    describe QuotasController do
      routes { Engine.routes }
      render_views

      describe '#show' do
        it 'responds with quota state and description' do
          user = create(:user)

          Pageflow.config.quotas.register(:entries, QuotaDouble.available)

          sign_in(user)
          get(:show, :id => 'entries', :format => 'json')

          expect(json_response(:path => :state)).to eq('available')
          expect(json_response(:path => :state_description)).to eq('Quota available')
        end

        it 'requires authentication' do
          get(:show, :id => 'entries', :format => 'json')

          expect(response.status).to eq(401)
        end
      end
    end
  end
end
