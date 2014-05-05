module Pageflow
  module UploadedFile
    extend ActiveSupport::Concern

    included do
      attr_writer :usage_id

      belongs_to :uploader, :class_name => 'User'
      belongs_to :entry

      has_many :usages, :as => :file, :class_name => 'Pageflow::FileUsage', :dependent => :destroy
      has_many :using_revisions, :through => :usages, :source => :revision
      has_many :using_entries, :through => :using_revisions, :source => :entry
      has_many :using_accounts, :through => :using_entries, :source => :account
    end

    # this prevents shadowing of usage_id that may be provided by SELECT alias
    def usage_id
      @usage_id || read_attribute(:usage_id)
    end
  end
end
