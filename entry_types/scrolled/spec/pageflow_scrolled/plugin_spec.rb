require 'spec_helper'

module PageflowScrolled
  RSpec.describe Plugin do
    describe 'FRONTEND_VERSION_SEED_DATA' do
      it 'returns 1 by default' do
        entry = create(:entry)

        result = Plugin::FRONTEND_VERSION_SEED_DATA.call(request: request,
                                                         entry: entry)

        expect(result).to eq(1)
      end

      it 'returns 2 if motif params is set to v2' do
        entry = create(:entry)

        result = Plugin::FRONTEND_VERSION_SEED_DATA.call(
          request: request('https://example.com/some-entry?frontend=v2'),
          entry: entry
        )

        expect(result).to eq(2)
      end

      it 'returns 2 if frontend_v2 feature is enabled for entry' do
        entry = create(:entry, with_feature: 'frontend_v2')

        result = Plugin::FRONTEND_VERSION_SEED_DATA.call(request: request,
                                                         entry: entry)

        expect(result).to eq(2)
      end

      def request(uri = 'https://example.com/some-entry')
        ActionDispatch::Request.new(Rack::MockRequest.env_for(uri))
      end
    end
  end
end
