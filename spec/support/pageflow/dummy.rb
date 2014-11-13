require 'pageflow/dummy/app'

module Pageflow
  module Dummy
    def self.setup
      App.new.generate
    end
  end
end
