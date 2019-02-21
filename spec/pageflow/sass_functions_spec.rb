require 'spec_helper'
require 'ostruct'

module Pageflow
  describe 'sass functions' do
    describe 'image-path-ignoring-asset-host' do
      it 'ignores asset host' do
        with_asset_host 'http://some-asset-host' do
          image_url_result = render_scss(<<-CSS)
            div { background-image: image-url("pageflow/down.png"); }
          CSS

          image_url_ignoring_asset_host_result = render_scss(<<-CSS)
            div { background-image: image-url-ignoring-asset-host("pageflow/down.png"); }
          CSS

          expect(image_url_result).to include('some-asset-host')
          expect(image_url_ignoring_asset_host_result).not_to include('some-asset-host')
        end
      end

      def render_scss(template)
        environment = Sprockets::Railtie.build_environment(Rails.application)
        engine = SassC::Rails::SassTemplate.new

        engine.call(environment: environment,
                    filename: '/',
                    data: template.strip,
                    metadata: {})[:data]
      end

      def with_asset_host(asset_host)
        backup = Rails.application.config.action_controller.asset_host
        Rails.application.config.action_controller.asset_host = asset_host

        yield
      ensure
        Rails.application.config.action_controller.asset_host = backup
      end
    end
  end
end
