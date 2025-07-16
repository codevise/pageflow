module Pageflow
  class ApplicationRecord < ActiveRecord::Base # rubocop:todo Style/Documentation
    self.abstract_class = true
  end
end
