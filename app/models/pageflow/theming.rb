module Pageflow
  class Theming < ActiveRecord::Base
    belongs_to :theme
    has_one :account, :foreign_key => :default_theming_id, :inverse_of => :default_theming

    def cname_domain
      cname.split('.').pop(2).join('.')
    end
  end
end