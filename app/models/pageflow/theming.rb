module Pageflow
  class Theming < ActiveRecord::Base
    belongs_to :theme
  end
end