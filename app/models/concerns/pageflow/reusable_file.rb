module Pageflow
  module ReusableFile
    extend ActiveSupport::Concern

    included do
      belongs_to :uploader, class_name: 'User', optional: true
      belongs_to :entry, optional: true
      belongs_to :parent_file, polymorphic: true, foreign_type: :parent_file_model_type,
                               optional: true

      has_many :usages, as: :file, class_name: 'Pageflow::FileUsage', dependent: :destroy
      has_one  :import,
               as: :file,
               class_name: 'Pageflow::FileImport',
               required: false,
               dependent: :destroy
      has_many :using_revisions, through: :usages, source: :revision
      has_many :using_entries, through: :using_revisions, source: :entry
      has_many :using_accounts, through: :using_entries, source: :account

      validate :parent_allows_type_for_nesting, :parent_belongs_to_same_entry

      after_save do
        usages.each(&:touch) if ready?
      end
    end

    def parent_allows_type_for_nesting
      return unless parent_file.present?

      parent_class = parent_file.class
      file_type_of_parent = Pageflow.config.file_types.find_by_model!(parent_class)
      models_of_nested_file_types = file_type_of_parent.nested_file_types.map(&:model)
      return if models_of_nested_file_types.include?(self.class)

      errors.add(:base, 'File type of provided parent file does not permit nesting files of '\
                        "type #{self.class.name}")
    end

    def parent_belongs_to_same_entry
      return unless parent_file.present?
      return if parent_file.using_entries.include?(entry)

      errors.add(:base, 'Parent file does not belong to same entry as nested file')
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

    def cache_key
      # Ensure the cache key changes when the state changes. There are
      # cases during processing where the state is updated multiple
      # times in a single second. Since `cache_key` relies on
      # `updated_at`, which only is acurate to the second, we need to
      # prevent caching outdated information.
      "#{super}-#{state}"
    end

    # The following are method defaults for file types that do not require processing/encoding.
    # They are overwritten with default values in UploadableFile for files that are uploaded
    # through the editor.

    # Overwritten if a file type provides a default url for its file.
    def url
      ''
    end

    # Overwritten in case of a file type providing its original (unprocessed) file
    # for download in the editor.
    # Defaults to the default url of the file (see above)
    def original_url
      url
    end

    # Overwritten with the basename of the file.
    def basename
      'unused'
    end

    # Overwritten with the extension of the file.
    def extension
      'unused'
    end

    # Overwritten in UploadableFile with attachment filename.
    def file_name
      'unused'
    end

    # Overwritten with the list of attachments of the file type
    # that should get included in export archives.
    def attachments_for_export
      []
    end

    # Overwritten in UploadableFile based on initial state_machine-state.
    # Defaults to false for files that only use the ReusableFile module
    def can_upload?
      false
    end

    # Overwritten with the conditions that need to be fulfilled in order to `retry`
    # whatever the file does (i.e. processing/transcoding).
    def retryable?
      raise 'Not implemented!'
    end

    # Overwritten with the conditions that need to be fulfilled in order to (re)use the file.
    def ready?
      raise 'Not implemented!'
    end

    # Overwritten with the conditions that indicate failure during processing.
    def failed?
      raise 'Not implemented!'
    end

    # If the conditions in retryable? are met then this method specifies what should happen when
    # a retry is requested, depending on the including class' processing state machine.
    def retry!
      raise 'Not implemented!'
    end

    # Gets called to trigger the `file_uploaded` event in the upload state machine of UploadableFile.
    # Files that are not uploaded through the editor (and therefore not using the
    # upload state machine of UploadableFile) can overwrite this method to trigger whatever
    # the file does (i.e. processing/transcoding), depending on the including class'
    # processing state machine.
    def publish!
      raise 'Not implemented!'
    end
  end
end
