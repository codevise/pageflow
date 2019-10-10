module Pageflow
  module EntryExportImport
    module RevisionSerialization
      # Turn revision into JSON compatible data structure.
      class Import
        DEFAULT_REMOVAL_COLUMNS = %w[id updated_at].freeze
        COMMON_FILE_COLUMNS = %w[entry_id rights created_at uploader_id
                                 confirmed_by_id parent_file_id parent_file_model_type].freeze

        def initialize(entry:, creator:, file_mappings: FileMappings.new)
          @entry = entry
          @creator = creator
          @file_mappings = file_mappings
        end

        def perform(data)
          Revision.transaction do
            revision = create_revision(data)

            create_storylines_chapters_and_pages(revision, data['storylines'])
            create_widgets(revision, data['widgets'])
            create_revision_components(revision, data['components'])
            create_files(revision, data['file_usages'])

            revision
          end
        end

        private

        attr_reader :entry, :creator, :file_mappings

        def create_revision(data)
          revision_attributes = data.except('storylines',
                                            'file_usages',
                                            'widgets',
                                            'components',
                                            *DEFAULT_REMOVAL_COLUMNS)

          unless Pageflow.config_for(entry).themes.names.include?(revision_attributes['theme_name'])
            revision_attributes['theme_name'] = 'default'
          end

          entry.revisions.create!(revision_attributes.merge(creator: creator)) do |revision|
            revision.published_until = Time.now if revision.published?
          end
        end

        def create_storylines_chapters_and_pages(revision, storylines_data)
          storylines_data.each do |storyline_data|
            chapters_data = storyline_data.delete('chapters')
            storyline = revision.storylines.create!(storyline_data.except(*DEFAULT_REMOVAL_COLUMNS))

            create_chapters_and_pages(storyline, chapters_data)
          end
        end

        def create_chapters_and_pages(storyline, chapters_data)
          chapters_data.each do |chapter_data|
            pages_data = chapter_data.delete('pages')
            chapter = storyline.chapters.create!(chapter_data.except(*DEFAULT_REMOVAL_COLUMNS))

            create_pages(chapter, pages_data)
          end
        end

        def create_pages(chapter, pages_data)
          pages_data.each do |page_data|
            chapter.pages.create!(page_data.except(*DEFAULT_REMOVAL_COLUMNS))
          end
        end

        def create_widgets(revision, widgets_data)
          widgets_data.each do |widget_data|
            revision.widgets.create!(widget_data.except(*DEFAULT_REMOVAL_COLUMNS))
          end
        end

        def create_revision_components(revision, revision_components_data)
          revision_components_data.each do |component_data|
            component_model = component_data.delete('class_name').constantize
            component_data['revision_id'] = revision.id
            component_model.create!(component_data.except(*DEFAULT_REMOVAL_COLUMNS))
          end
        end

        def create_files(revision, file_usages_data)
          Pageflow.config.file_types.each do |file_type|
            filter_by_file_type(file_usages_data, file_type).each do |file_type_usage_data|
              file_data = file_type_usage_data.delete('file')

              file_type_usage_data['file_id'] =
                file_mappings.find_or_store(file_data['id'], file_type) do
                  create_file(file_data, file_type)
                end

              revision.file_usages.create!(file_type_usage_data.except(*DEFAULT_REMOVAL_COLUMNS))
            end
          end
        end

        def filter_by_file_type(file_usages_data, file_type)
          file_usages_data.select do |file_usage|
            file_usage['file_type'].eql?(file_type.type_name)
          end
        end

        def create_file(file_data, file_type)
          rewrite_entry_reference(file_data)
          rewrite_user_references(file_data)
          rewrite_parent_file_reference(file_data)
          custom_file_attribute_names = rewrite_custom_attributes(file_data, file_type)

          file_type.model.create!(file_data.slice(*COMMON_FILE_COLUMNS,
                                                  *custom_file_attribute_names)) do |file|
            assign_attachments_attributes(file, file_data)
          end
        end

        def rewrite_entry_reference(file_data)
          file_data['entry_id'] = entry.id
        end

        def rewrite_user_references(file_data)
          file_data['uploader_id'] = creator.id if file_data['uploader_id'].present?
          file_data['confirmed_by_id'] = creator.id if file_data['confirmed_by_id'].present?
        end

        def rewrite_parent_file_reference(file_data)
          rewrite_foreign_key(file_data, 'parent_file_id', file_data['parent_file_model_type'])
        end

        def rewrite_custom_attributes(file_data, file_type)
          file_type.custom_attributes.stringify_keys.map do |attribute_name, options|
            rewrite_foreign_key(file_data, attribute_name, options[:model]) if options[:model]
            attribute_name
          end
        end

        def rewrite_foreign_key(attributes, attribute_name, model_name)
          exported_id = attributes[attribute_name]
          return unless exported_id

          attributes[attribute_name] = file_mappings.imported_id_for(model_name, exported_id)
        end

        def assign_attachments_attributes(file, file_data)
          file.attachments_for_export.each do |attachment|
            file.assign_attributes(file_data.slice("#{attachment.name}_file_name",
                                                   "#{attachment.name}_content_type",
                                                   "#{attachment.name}_file_size",
                                                   "#{attachment.name}_updated_at"))
          end
        end
      end
    end
  end
end
