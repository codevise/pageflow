require 'spec_helper'

module Pageflow
  describe '/editor/entries/:id/<entry_type>', type: :request do
    it 'delegates to editor app' do
      pageflow_configure do |config|
        route_set = ActionDispatch::Routing::RouteSet.new.tap do |routes|
          routes.draw do
            get('/custom_route', to: ->(_env) { ['200', {}, ['custom']] })
          end
        end

        TestEntryType.register(config,
                               name: 'test',
                               editor_app: route_set)
      end
      Rails.application.reload_routes!

      entry = create(:entry)

      get("/editor/entries/#{entry.id}/test/custom_route")

      expect(response.status).to eq(200)
    end

    it 'sets entry_type param' do
      editor_app = lambda do |env|
        entry_type = ActionDispatch::Request.new(env).params['entry_type']
        ['200', {}, ["Entry type #{entry_type}"]]
      end

      pageflow_configure do |config|
        TestEntryType.register(config,
                               name: 'test',
                               editor_app: editor_app)
      end
      Rails.application.reload_routes!

      entry = create(:entry)

      get("/editor/entries/#{entry.id}/test/custom_route")

      expect(response.body).to eq('Entry type test')
    end

    it 'lets different entry types define the same editor routes' do
      pageflow_configure do |config|
        route_set1 = ActionDispatch::Routing::RouteSet.new.tap do |routes|
          routes.draw do
            get('/custom_route', to: ->(_env) { ['200', {}, ['custom1']] })
          end
        end

        route_set2 = ActionDispatch::Routing::RouteSet.new.tap do |routes|
          routes.draw do
            get('/custom_route', to: ->(_env) { ['200', {}, ['custom2']] })
          end
        end

        TestEntryType.register(config,
                               name: 'test1',
                               editor_app: route_set1)
        TestEntryType.register(config,
                               name: 'test2',
                               editor_app: route_set2)
      end
      Rails.application.reload_routes!

      entry = create(:entry)

      get("/editor/entries/#{entry.id}/test2/custom_route")

      expect(response.body).to eq('custom2')
    end
  end
end
