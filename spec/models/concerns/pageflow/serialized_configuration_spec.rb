require 'spec_helper'

module Pageflow
  describe SerializedConfiguration do
    let(:model) do
      Class.new(ActiveRecord::Base) do
        self.table_name = 'pageflow_pages'

        include SerializedConfiguration
      end
    end

    it 'stores arbitrary options' do
      configurable = model.new

      configurable.configuration = {'some' => 'option'}

      expect(configurable.configuration['some']).to eq('option')
    end
  end
end
