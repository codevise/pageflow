module Pageflow
  module UploadedFile
    extend ActiveSupport::Concern

    included do
      belongs_to :uploader, :class_name => 'User'
      belongs_to :entry
      belongs_to :parent_file, polymorphic: true, foreign_type: :parent_file_model_type

      has_many :usages, :as => :file, :class_name => 'Pageflow::FileUsage', :dependent => :destroy
      has_many :using_revisions, :through => :usages, :source => :revision
      has_many :using_entries, :through => :using_revisions, :source => :entry
      has_many :using_accounts, :through => :using_entries, :source => :account

      validate :parent_allows_type_for_nesting, :parent_belongs_to_same_entry
    end

    def parent_allows_type_for_nesting
      if parent_file.present?
        parent_class = parent_file.class
        file_type_of_parent = Pageflow.config.file_types.find_by_model!(parent_class)
        models_of_nested_file_types = file_type_of_parent.nested_file_types.map(&:model)
        unless models_of_nested_file_types.include?(self.class)
          errors[:base] << 'File type of provided parent file does not permit nesting files of '\
                           "type #{self.class.name}"
        end
      end
    end

    def parent_belongs_to_same_entry
      if parent_file.present?
        unless parent_file.using_entries.include?(entry)
          errors[:base] << 'Parent file does not belong to same entry as nested file'
        end
      end
    end

    def nested_files(model)
      model_table_name = model.table_name
      model
        .select("#{model_table_name}.*")
        .where("#{model_table_name}.parent_file_id = #{id} AND "\
               "#{model_table_name}.parent_file_model_type = '#{self.class.name}'")
    end

    def file_type
      Pageflow.config.file_types.find_by_model!(self.class)
    end
  end
end
