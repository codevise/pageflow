module Pageflow
  # A simplified view of an entry at a given revision. Hides the
  # revision concept and makes revision attributes available along
  # with entry attributes.
  class EntryAtRevision
    include ActiveModel::Conversion

    attr_reader :entry, :revision

    def initialize(entry, revision, theme: nil)
      @entry = entry
      @revision = revision
      @theme = theme
    end

    delegate(:id, :slug,
             :entry_type,
             :account, :theming,
             :feature_state, :enabled_feature_names,
             :edit_lock,
             :password_digest,
             :to_model, :to_key, :to_param, :persisted?, :to_json,
             :first_published_at, :published_until, :published?,
             :type_name,
             to: :entry)

    delegate(:title, :summary, :credits,
             :widgets,
             :storylines, :main_storyline_chapters, :chapters, :pages,
             :share_url, :share_image_id, :share_image_x, :share_image_y,
             :share_providers, :active_share_providers,
             :find_files, :find_file, :find_file_by_perma_id,
             :image_files, :video_files, :audio_files,
             :locale,
             :author, :publisher, :keywords,
             :published_at,
             :configuration,
             to: :revision)

    def resolve_widgets(options = {})
      widgets.resolve(Pageflow.config_for(entry), options)
    end

    def theme
      @theme ||= CustomizedTheme.find(entry: entry, theme: revision.theme)
    end

    def home_button
      HomeButton.new(revision, theming)
    end

    def overview_button
      OverviewButton.new(revision)
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
  end
end
