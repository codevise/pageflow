require 'spec_helper'

module PageflowScrolled
  RSpec.describe Plugin do
    describe 'FRONTEND_VERSION_SEED_DATA' do
      it 'returns 1 by default' do
        result = Plugin::FRONTEND_VERSION_SEED_DATA.call(request: request)

        expect(result).to eq(1)
      end

      it 'returns 2 if motif params is set to v2' do
        result = Plugin::FRONTEND_VERSION_SEED_DATA.call(
          request: request('https://example.com/some-entry?frontend=v2')
        )

        expect(result).to eq(2)
      end

      def request(uri = 'https://example.com/some-entry')
        ActionDispatch::Request.new(Rack::MockRequest.env_for(uri))
      end
    end
  end
end
