require 'spec_helper'

module PageflowScrolled
  RSpec.describe Plugin do
    describe 'FRONTEND_VERSION_SEED_DATA' do
      it 'returns 1 by default' do
        entry = create(:entry)

        result = Plugin::FRONTEND_VERSION_SEED_DATA.call(request:,
                                                         entry:)

        expect(result).to eq(1)
      end

      it 'returns 2 if motif params is set to v2' do
        entry = create(:entry)

        result = Plugin::FRONTEND_VERSION_SEED_DATA.call(
          request: request('https://example.com/some-entry?frontend=v2'),
          entry:
        )

        expect(result).to eq(2)
      end

      it 'returns 2 if frontend_v2 feature is enabled for entry' do
        entry = create(:entry, with_feature: 'frontend_v2')

        result = Plugin::FRONTEND_VERSION_SEED_DATA.call(request:,
                                                         entry:)

        expect(result).to eq(2)
      end

      def request(uri = 'https://example.com/some-entry')
        ActionDispatch::Request.new(Rack::MockRequest.env_for(uri))
      end
    end

    describe 'IFRAME_EMBED_CONSENT_VENDOR' do
      it 'returns nil if consent not required' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.consent_vendor_host_matchers = {
              /\.typeform\.com$/ => 'typeform'
            }
          end
        end

        result = Plugin::IFRAME_EMBED_CONSENT_VENDOR.call(
          entry: create(:published_entry, type_name: 'scrolled'),
          configuration: {
            'requireConsent' => false,
            'source' => 'https://foo.typeform.com/to/1234'
          }
        )

        expect(result).to eq(nil)
      end

      it 'detects vendor from source when consent is required' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.consent_vendor_host_matchers = {
              /\.typeform\.com$/ => 'typeform'
            }
          end
        end

        result = Plugin::IFRAME_EMBED_CONSENT_VENDOR.call(
          entry: create(:published_entry, type_name: 'scrolled'),
          configuration: {
            'requireConsent' => true,
            'source' => 'https://foo.typeform.com/to/1234'
          }
        )

        expect(result).to eq('typeform')
      end

      it 'returns nil for unknown source' do
        result = Plugin::IFRAME_EMBED_CONSENT_VENDOR.call(
          entry: create(:published_entry, type_name: 'scrolled'),
          configuration: {
            'requireConsent' => true,
            'source' => 'https://example.com'
          }
        )

        expect(result).to eq(nil)
      end

      it 'returns nil for invalid source' do
        result = Plugin::IFRAME_EMBED_CONSENT_VENDOR.call(
          entry: create(:published_entry, type_name: 'scrolled'),
          configuration: {
            'requireConsent' => true,
            'source' => 'this is not a uri $%&'
          }
        )

        expect(result).to eq(nil)
      end
    end
  end
end
