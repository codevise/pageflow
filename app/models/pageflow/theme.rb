module Pageflow
  class Theme < ActiveRecord::Base
    has_and_belongs_to_many :accounts, :join_table => 'pageflow_accounts_themes'
    has_many :themings
  end
end
