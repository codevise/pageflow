require 'spec_helper'

describe Pageflow do
  describe '.active_admin_load_path' do
    it 'returns path to admin directory' do
      result = Pageflow.active_admin_load_path

      expect(result).to match(/admins$/)
    end
  end
end
