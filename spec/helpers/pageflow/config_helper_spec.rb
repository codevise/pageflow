require 'spec_helper'

module Pageflow
  describe ConfigHelper do
    describe '#editor_config_seeds' do
      it 'includes confirm_encoding_jobs option' do
        Pageflow.config.confirm_encoding_jobs = true

        result = JSON.parse(helper.editor_config_seeds)

        expect(result['confirmEncodingJobs']).to eq(true)
      end
    end
  end
end
