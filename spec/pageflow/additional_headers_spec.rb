require 'spec_helper'

module Pageflow
  describe AdditionalHeaders do
    it 'returns empty hash by default' do
      additional_headers = AdditionalHeaders.new
      entry = create(:published_entry)

      result = additional_headers.for(entry, request)

      expect(result).to eq({})
    end

    it 'merges multiple registered hashes of headers' do
      additional_headers = AdditionalHeaders.new
      entry = create(:published_entry)

      additional_headers.register('Some' => 'value')
      additional_headers.register('Other' => 'header')
      additional_headers.register(proc { {'Dynamic' => 'header'} })
      result = additional_headers.for(entry, request)

      expect(result).to eq('Some' => 'value',
                           'Other' => 'header',
                           'Dynamic' => 'header')
    end

    def request(uri = 'https://example.com')
      ActionDispatch::Request.new(Rack::MockRequest.env_for(uri))
    end
  end
end
