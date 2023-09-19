require 'spec_helper'

module PageflowScrolled
  RSpec.describe ContentElementConsentVendors do
    describe '#by_content_element_id' do
      it 'returns data from registered callables' do
        content_element_consent_vendors = ContentElementConsentVendors.new
        content_element_consent_vendors.register(
          ->(configuration:) { configuration['vendor'] },
          content_element_type_name: 'someEmbed'
        )
        content_element_consent_vendors.register(
          ->(**) { 'otherVendor' },
          content_element_type_name: 'otherEmbed'
        )

        published_entry = create(:published_entry)
        content_element = create(:content_element,
                                 revision: published_entry.revision,
                                 type_name: 'someEmbed',
                                 configuration: {vendor: 'someVendor'})
        other_content_element = create(:content_element,
                                       revision: published_entry.revision,
                                       type_name: 'otherEmbed')

        result = content_element_consent_vendors.by_content_element_id(
          published_entry
        )

        expect(result)
          .to eq(content_element.id => 'someVendor',
                 other_content_element.id => 'otherVendor')
      end
    end
  end
end
