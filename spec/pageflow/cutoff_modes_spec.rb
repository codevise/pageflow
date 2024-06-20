require 'spec_helper'

module Pageflow
  describe CutoffModes do
    let :request do
      ActionDispatch::Request.new(Rack::MockRequest.env_for('https://example.com'))
    end

    it 'returns false by default' do
      site = create(:site)
      entry = create(:published_entry, site:)

      result = Pageflow.config.cutoff_modes.enabled_for?(entry, request)

      expect(result).to eq(false)
    end

    it 'returns result from cutoff mode configured in site' do
      pageflow_configure do |config|
        config.cutoff_modes.register(:test, proc { true })
      end
      site = create(:site, cutoff_mode_name: 'test')
      entry = create(:published_entry, site:)

      result = Pageflow.config.cutoff_modes.enabled_for?(entry, request)

      expect(result).to eq(true)
    end

    it 'passes entry and request to registered proc' do
      pageflow_configure do |config|
        config.cutoff_modes.register(:test, proc { true })
      end
      site = create(:site, cutoff_mode_name: 'test')
      entry = create(:published_entry, site:)

      expect { |probe|
        cutoff_modes = Pageflow.config.cutoff_modes
        cutoff_modes.register(:test, probe.to_proc)
        cutoff_modes.enabled_for?(entry, request)
      }.to yield_with_args(entry, request)
    end
  end
end
