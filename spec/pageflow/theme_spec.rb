require 'spec_helper'

module Pageflow
  describe Theme do
    describe '#stylesheet_path' do
      it 'is based on name' do
        theme = Theme.new(:custom)

        expect(theme.stylesheet_path).to eq('pageflow/themes/custom.css')
      end
    end
  end
end
