module Pageflow
  class Theme < ActiveRecord::Base
    has_many :accounts
    has_many :themings
  end
end
