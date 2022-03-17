require 'spec_helper'

module PageflowScrolled
  RSpec.describe AdditionalSeedData do
    describe '#register' do
      it 'raises error if registered name is taken' do
        dynamic_seed_data = AdditionalSeedData.new
        dynamic_seed_data.register('taken', proc {})

        expect {
          dynamic_seed_data.register('taken', proc {})
        }.to raise_error(/already registered/)
      end
    end

    describe '#for' do
      it 'returns data from registered callables' do
        dynamic_seed_data = AdditionalSeedData.new
        published_entry = create(:published_entry, title: 'some title')
        dynamic_seed_data.register('static', proc { {some: 'data'} })
        dynamic_seed_data.register('dynamic',
                                   lambda do |entry:, request:, **|
                                     {title: entry.title,
                                      param: request.params[:some]}
                                   end)

        result = dynamic_seed_data.for(
          published_entry,
          request('https://example.com/some-entry?some=param')
        )

        expect(result).to eq('static' => {some: 'data'},
                             'dynamic' => {title: 'some title',
                                           param: 'param'})
      end
    end

    def request(uri = 'https://example.com')
      ActionDispatch::Request.new(Rack::MockRequest.env_for(uri))
    end
  end
end
