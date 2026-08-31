require 'spec_helper'

module PageflowScrolled
  RSpec.describe Plugin do
    describe 'lottie_animation_content_element feature', type: :helper do
      before { helper.extend(PacksHelper) }

      it 'registers frontend pack for entries using lottie animations' do
        entry = create(:published_entry,
                       type_name: 'scrolled',
                       with_feature: 'lottie_animation_content_element')
        create(:content_element, revision: entry.revision, type_name: 'lottieAnimation')

        result = helper.scrolled_frontend_packs(entry, entry_mode: :published)

        expect(result).to include('pageflow-scrolled/contentElements/lottieAnimation-frontend')
      end

      it 'does not register frontend pack for entries without the feature' do
        entry = create(:published_entry, type_name: 'scrolled')
        create(:content_element, revision: entry.revision, type_name: 'lottieAnimation')

        result = helper.scrolled_frontend_packs(entry, entry_mode: :published)

        expect(result).not_to include('pageflow-scrolled/contentElements/lottieAnimation-frontend')
      end
    end

    describe 'configuration schemas' do
      it 'reads schemas shipped by the engine' do
        entry = create(:published_entry, type_name: 'scrolled')

        schemas = Pageflow.config_for(entry).configuration_schemas

        expect(schemas.find(model: 'contentElement', type_name: 'hotspots')).to be_present
      end

      it 'describes file references of sections' do
        entry = create(:published_entry, type_name: 'scrolled')

        schemas = Pageflow.config_for(entry).configuration_schemas
        locations = FileReferenceLocations.new(schemas).for(schemas.find(model: 'section'))

        expect(locations.map { |location| location['path'] })
          .to contain_exactly(%w[backdrop image], %w[backdrop imageMobile],
                              %w[backdrop video], %w[backdrop videoMobile],
                              ['atmoAudioFileId'])
      end
    end

    describe 'IFRAME_EMBED_CONSENT_VENDOR' do
      it 'returns nil if consent not required' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.consent_vendor_url_matchers = {
              %r{\.typeform\.com/} => 'typeform'
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
            entry_type_config.consent_vendor_url_matchers = {
              %r{\.typeform\.com/} => 'typeform'
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

      it 'detects vendor from path-based url matcher' do
        pageflow_configure do |config|
          config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
            entry_type_config.consent_vendor_url_matchers = {
              %r{google\.com/maps/embed} => 'googleMaps'
            }
          end
        end

        result = Plugin::IFRAME_EMBED_CONSENT_VENDOR.call(
          entry: create(:published_entry, type_name: 'scrolled'),
          configuration: {
            'requireConsent' => true,
            'source' => 'https://www.google.com/maps/embed?pb=1234'
          }
        )

        expect(result).to eq('googleMaps')
      end

      it 'supports deprecated consent_vendor_host_matchers setter' do
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

    describe 'SOCIAL_EMBED_CONSENT_VENDOR' do
      it 'returns provider name for X/Twitter' do
        result = Plugin::SOCIAL_EMBED_CONSENT_VENDOR.call(
          configuration: {
            'provider' => 'x'
          }
        )

        expect(result).to eq('x')
      end

      it 'returns provider name for Instagram' do
        result = Plugin::SOCIAL_EMBED_CONSENT_VENDOR.call(
          configuration: {
            'provider' => 'instagram'
          }
        )

        expect(result).to eq('instagram')
      end

      it 'returns provider name for Bluesky' do
        result = Plugin::SOCIAL_EMBED_CONSENT_VENDOR.call(
          configuration: {
            'provider' => 'bluesky'
          }
        )

        expect(result).to eq('bluesky')
      end

      it 'returns provider name for TikTok' do
        result = Plugin::SOCIAL_EMBED_CONSENT_VENDOR.call(
          configuration: {
            'provider' => 'tiktok'
          }
        )

        expect(result).to eq('tiktok')
      end

      it 'returns nil for unknown provider' do
        result = Plugin::SOCIAL_EMBED_CONSENT_VENDOR.call(
          configuration: {
            'provider' => 'unknown'
          }
        )

        expect(result).to eq(nil)
      end

      it 'returns nil when provider field is missing' do
        result = Plugin::SOCIAL_EMBED_CONSENT_VENDOR.call(
          configuration: {}
        )

        expect(result).to eq(nil)
      end
    end
  end
end
