module Pageflow
  class DraftEntry
    include ActiveModel::Conversion

    class InvalidForeignKeyCustomAttributeError < StandardError; end

    attr_reader :entry, :draft

    delegate(:id, :slug,
             :entry_type,
             :edit_lock, :account, :theming, :slug,
             :enabled_feature_names,
             :published_until, :published?,
             :password_digest,
             :to_model, :to_key, :persisted?, :to_json,
             :first_published_at,
             :type_name,
             :to => :entry)

    delegate(:title, :summary, :credits,
             :widgets,
             :storylines, :main_storyline_chapters, :chapters, :pages,
             :share_url, :share_image_id, :share_image_x, :share_image_y,
             :share_providers, :active_share_providers,
             :find_files, :find_file, :find_file_by_perma_id,
             :image_files, :video_files, :audio_files,
             :locale,
             :author, :publisher, :keywords,
             :theme,
             :published_at,
             :configuration,
             :to => :draft)

    def initialize(entry, draft = nil)
      @entry = entry
      @draft = draft || entry.draft
    end

    alias revision draft

    # So we can always get to the original Entry title.
    def entry_title
      entry.title
    end

    def create_file!(file_type, attributes)
      check_foreign_key_custom_attributes(file_type.custom_attributes, attributes)

      file = file_type.model.create!(attributes.except(:configuration)) do |f|
        f.entry = entry
      end

      usage = @draft.file_usages.create_with_lock!(file: file,
                                                   configuration: attributes[:configuration])
      UsedFile.new(file, usage)
    end

    def remove_file(file)
      draft.file_usages.where(file: file).destroy_all

      file.file_type.nested_file_types.each do |nested_file_type|
        nested_file_ids = file.nested_files(nested_file_type.model).map(&:id)

        draft
          .file_usages
          .where(file_type: nested_file_type.model.name,
                 file_id: nested_file_ids)
          .destroy_all
      end

      file.destroy if file.usages.reload.empty?
    end

    def use_file(file)
      draft.file_usages.create!(file: file.to_model,
                                configuration: file.configuration)
    end

    def save!
      draft.save!
    end

    def update_meta_data!(attributes)
      draft.update_attributes!(attributes)
    end

    def self.find(id)
      new(Entry.find(id))
    end

    def self.for_file_usage(usage)
      new(usage.revision.entry)
    end

    def self.accessible_by(ability, action)
      Entry.includes(:draft).accessible_by(ability, action).map do |entry|
        DraftEntry.new(entry)
      end
    end

    def stylesheet_model
      draft
    end

    def stylesheet_cache_key
      draft.cache_key
    end

    def home_button
      HomeButton.new(draft, theming)
    end

    def overview_button
      OverviewButton.new(draft)
    end

    def manual_start
      revision.configuration['manual_start']
    end

    def emphasize_chapter_beginning
      revision.configuration['emphasize_chapter_beginning']
    end

    def emphasize_new_pages
      revision.configuration['emphasize_new_pages']
    end

    def resolve_widgets(options = {})
      widgets.resolve(Pageflow.config_for(entry), options)
    end

    private

    def check_foreign_key_custom_attributes(custom_attributes, attributes)
      custom_attributes
        .each do |attribute_name, options|
          file_type = options[:model]
          file_id = attributes[attribute_name]

          next if !file_type || file_is_used(file_type, file_id)

          raise(InvalidForeignKeyCustomAttributeError,
                "Custom attribute #{attribute_name} references #{file_type} #{file_id} " \
                'which is not used in this revsion')
        end
    end

    def file_is_used(file_type, file_id)
      draft.file_usages.where(file_type: file_type, file_id: file_id).exists?
    end
  end
end
