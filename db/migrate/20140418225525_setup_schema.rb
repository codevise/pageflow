# rubocop:disable Metrics/LineLength, Metrics/BlockLength

class SetupSchema < ActiveRecord::Migration[5.2]
  def change
    create_table 'friendly_id_slugs', id: :integer, options: 'ENGINE=InnoDB', force: :cascade do |t|
      t.string 'slug', null: false
      t.integer 'sluggable_id', null: false
      t.string 'sluggable_type', limit: 50
      t.string 'scope'
      t.datetime 'created_at'
      t.index ['slug', 'sluggable_type', 'scope'], name: 'index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope', unique: true
      t.index ['slug', 'sluggable_type'], name: 'index_friendly_id_slugs_on_slug_and_sluggable_type'
      t.index ['sluggable_id'], name: 'index_friendly_id_slugs_on_sluggable_id'
      t.index ['sluggable_type'], name: 'index_friendly_id_slugs_on_sluggable_type'
    end

    create_table 'pageflow_accounts', id: :integer, options: 'ENGINE=InnoDB', force: :cascade do |t|
      t.string 'name', default: '', null: false
      t.datetime 'created_at'
      t.datetime 'updated_at'
      t.string 'default_file_rights', default: '', null: false
      t.string 'landing_page_name', default: '', null: false
      t.integer 'default_theming_id'
      t.text 'features_configuration'
      t.integer 'users_count', default: 0, null: false
      t.integer 'entries_count', default: 0, null: false
      t.index ['default_theming_id'], name: 'index_pageflow_accounts_on_default_theming_id'
    end

    create_table 'pageflow_accounts_themes', id: false, options: 'ENGINE=InnoDB', force: :cascade do |t|
      t.integer 'account_id'
      t.integer 'theme_name'
    end

    create_table 'pageflow_audio_files', id: :integer, options: 'ENGINE=InnoDB', force: :cascade do |t|
      t.integer 'entry_id'
      t.integer 'uploader_id'
      t.string 'attachment_on_filesystem_file_name'
      t.string 'attachment_on_filesystem_content_type'
      t.bigint 'attachment_on_filesystem_file_size'
      t.datetime 'attachment_on_filesystem_updated_at'
      t.string 'attachment_on_s3_file_name'
      t.string 'attachment_on_s3_content_type'
      t.bigint 'attachment_on_s3_file_size'
      t.datetime 'attachment_on_s3_updated_at'
      t.integer 'job_id'
      t.string 'state'
      t.decimal 'encoding_progress', precision: 5, scale: 2
      t.datetime 'created_at'
      t.datetime 'updated_at'
      t.string 'encoding_error_message'
      t.integer 'duration_in_ms'
      t.string 'format'
      t.string 'rights', default: '', null: false
      t.integer 'confirmed_by_id'
      t.integer 'parent_file_id'
      t.string 'parent_file_model_type'
      t.index ['parent_file_id', 'parent_file_model_type'], name: 'index_audio_files_on_parent_id_and_parent_model_type'
    end

    create_table 'pageflow_chapters', id: :integer, options: 'ENGINE=InnoDB', force: :cascade do |t|
      t.datetime 'created_at'
      t.datetime 'updated_at'
      t.integer 'position', default: 0, null: false
      t.string 'title', default: '', null: false
      t.text 'configuration'
      t.integer 'storyline_id'
      t.index ['storyline_id'], name: 'index_pageflow_chapters_on_storyline_id'
    end

    create_table 'pageflow_edit_locks', id: :integer, options: 'ENGINE=InnoDB', force: :cascade do |t|
      t.integer 'user_id'
      t.integer 'entry_id'
      t.datetime 'created_at'
      t.datetime 'updated_at'
      t.index ['entry_id'], name: 'index_pageflow_edit_locks_on_entry_id'
      t.index ['user_id'], name: 'index_pageflow_edit_locks_on_user_id'
    end

    create_table 'pageflow_entries', id: :integer, options: 'ENGINE=InnoDB', force: :cascade do |t|
      t.string 'title', default: '', null: false
      t.datetime 'created_at'
      t.datetime 'updated_at'
      t.string 'slug', null: false
      t.integer 'account_id'
      t.integer 'folder_id'
      t.integer 'theming_id'
      t.text 'features_configuration'
      t.string 'password_digest'
      t.datetime 'first_published_at'
      t.datetime 'edited_at'
      t.integer 'users_count', default: 0, null: false
      t.index ['account_id'], name: 'index_pageflow_entries_on_account_id'
      t.index ['folder_id'], name: 'index_pageflow_entries_on_folder_id'
      t.index ['slug'], name: 'index_pageflow_entries_on_slug', unique: true
      t.index ['theming_id'], name: 'index_pageflow_entries_on_theming_id'
    end

    create_table 'pageflow_file_usages', id: :integer, options: 'ENGINE=InnoDB', force: :cascade do |t|
      t.integer 'revision_id'
      t.integer 'file_id'
      t.string 'file_type'
      t.datetime 'created_at'
      t.datetime 'updated_at'
      t.text 'configuration'
      t.index ['file_id', 'file_type'], name: 'index_pageflow_file_usages_on_file_id_and_file_type'
      t.index ['revision_id'], name: 'index_pageflow_file_usages_on_revision_id'
    end

    create_table 'pageflow_folders', id: :integer, options: 'ENGINE=InnoDB', force: :cascade do |t|
      t.string 'name'
      t.integer 'account_id'
      t.datetime 'created_at'
      t.datetime 'updated_at'
      t.index ['account_id'], name: 'index_pageflow_folders_on_account_id'
    end

    create_table 'pageflow_image_files', id: :integer, options: 'ENGINE=InnoDB', force: :cascade do |t|
      t.integer 'entry_id'
      t.integer 'uploader_id'
      t.string 'unprocessed_attachment_file_name'
      t.string 'unprocessed_attachment_content_type'
      t.bigint 'unprocessed_attachment_file_size'
      t.datetime 'unprocessed_attachment_updated_at'
      t.string 'processed_attachment_file_name'
      t.string 'processed_attachment_content_type'
      t.bigint 'processed_attachment_file_size'
      t.datetime 'processed_attachment_updated_at'
      t.string 'state'
      t.datetime 'created_at'
      t.datetime 'updated_at'
      t.integer 'width'
      t.integer 'height'
      t.string 'rights', default: '', null: false
      t.integer 'parent_file_id'
      t.string 'parent_file_model_type'
      t.index ['parent_file_id', 'parent_file_model_type'], name: 'index_image_files_on_parent_id_and_parent_model_type'
    end

    create_table 'pageflow_memberships', id: :integer, options: 'ENGINE=InnoDB', force: :cascade do |t|
      t.integer 'user_id'
      t.integer 'entity_id'
      t.string 'name'
      t.datetime 'created_at'
      t.datetime 'updated_at'
      t.string 'entity_type'
      t.string 'role', default: 'editor', null: false
      t.index ['entity_id'], name: 'index_pageflow_memberships_on_entity_id'
      t.index ['user_id'], name: 'index_pageflow_memberships_on_user_id'
    end

    create_table 'pageflow_pages', id: :integer, options: 'ENGINE=InnoDB', force: :cascade do |t|
      t.integer 'chapter_id'
      t.string 'template', default: '', null: false
      t.text 'configuration'
      t.datetime 'created_at'
      t.datetime 'updated_at'
      t.integer 'position', default: 0, null: false
      t.boolean 'display_in_navigation', default: true
      t.integer 'perma_id'
      t.index ['chapter_id'], name: 'index_pageflow_pages_on_chapter_id'
      t.index ['perma_id'], name: 'index_pageflow_pages_on_perma_id'
    end

    create_table 'pageflow_revisions', id: :integer, options: 'ENGINE=InnoDB', force: :cascade do |t|
      t.integer 'entry_id'
      t.integer 'creator_id'
      t.datetime 'published_at'
      t.datetime 'published_until'
      t.datetime 'created_at'
      t.datetime 'updated_at'
      t.text 'credits'
      t.string 'title', default: '', null: false
      t.text 'summary'
      t.boolean 'manual_start', default: false
      t.integer 'restored_from_id'
      t.datetime 'frozen_at'
      t.string 'snapshot_type'
      t.string 'home_url', default: '', null: false
      t.boolean 'home_button_enabled', default: false, null: false
      t.boolean 'emphasize_chapter_beginning', default: false, null: false
      t.boolean 'emphasize_new_pages', default: false, null: false
      t.integer 'share_image_id'
      t.integer 'share_image_x'
      t.integer 'share_image_y'
      t.string 'locale'
      t.boolean 'password_protected'
      t.string 'author'
      t.string 'publisher'
      t.string 'keywords'
      t.boolean 'overview_button_enabled', default: true, null: false
      t.string 'share_url', default: '', null: false
      t.string 'theme_name', default: 'default', null: false
      t.index ['entry_id', 'published_at', 'published_until'], name: 'index_pageflow_revisions_on_publication_timestamps'
      t.index ['restored_from_id'], name: 'index_pageflow_revisions_on_restored_from_id'
    end

    create_table 'pageflow_storylines', id: :integer, options: 'ENGINE=InnoDB', force: :cascade do |t|
      t.integer 'perma_id'
      t.integer 'revision_id'
      t.integer 'position'
      t.text 'configuration'
      t.datetime 'created_at'
      t.datetime 'updated_at'
      t.index ['revision_id'], name: 'index_pageflow_storylines_on_revision_id'
    end

    create_table 'pageflow_text_track_files', id: :integer, options: 'ENGINE=InnoDB', force: :cascade do |t|
      t.integer 'entry_id'
      t.integer 'uploader_id'
      t.string 'state'
      t.string 'rights'
      t.string 'attachment_on_filesystem_file_name'
      t.string 'attachment_on_filesystem_content_type'
      t.bigint 'attachment_on_filesystem_file_size'
      t.datetime 'attachment_on_filesystem_updated_at'
      t.string 'attachment_on_s3_file_name'
      t.string 'attachment_on_s3_content_type'
      t.bigint 'attachment_on_s3_file_size'
      t.datetime 'attachment_on_s3_updated_at'
      t.datetime 'created_at'
      t.datetime 'updated_at'
      t.integer 'parent_file_id'
      t.string 'parent_file_model_type'
      t.text 'configuration'
      t.string 'processed_attachment_file_name'
      t.string 'processed_attachment_content_type'
      t.bigint 'processed_attachment_file_size'
      t.datetime 'processed_attachment_updated_at'
      t.index ['entry_id'], name: 'index_pageflow_text_track_files_on_entry_id'
      t.index ['parent_file_id', 'parent_file_model_type'], name: 'index_text_track_files_on_parent_id_and_parent_model_type'
      t.index ['uploader_id'], name: 'index_pageflow_text_track_files_on_uploader_id'
    end

    create_table 'pageflow_themings', id: :integer, options: 'ENGINE=InnoDB', force: :cascade do |t|
      t.string 'imprint_link_url'
      t.string 'imprint_link_label'
      t.string 'copyright_link_url'
      t.string 'copyright_link_label'
      t.integer 'account_id'
      t.datetime 'created_at'
      t.datetime 'updated_at'
      t.string 'cname', default: '', null: false
      t.string 'theme_name'
      t.string 'home_url', default: '', null: false
      t.boolean 'home_button_enabled_by_default', default: true, null: false
      t.string 'additional_cnames'
      t.string 'default_author'
      t.string 'default_publisher'
      t.string 'default_keywords'
      t.index ['cname'], name: 'index_pageflow_themings_on_cname'
    end

    create_table 'pageflow_video_files', id: :integer, options: 'ENGINE=InnoDB', force: :cascade do |t|
      t.integer 'entry_id'
      t.integer 'uploader_id'
      t.string 'attachment_on_filesystem_file_name'
      t.string 'attachment_on_filesystem_content_type'
      t.bigint 'attachment_on_filesystem_file_size'
      t.datetime 'attachment_on_filesystem_updated_at'
      t.string 'attachment_on_s3_file_name'
      t.string 'attachment_on_s3_content_type'
      t.bigint 'attachment_on_s3_file_size'
      t.datetime 'attachment_on_s3_updated_at'
      t.integer 'job_id'
      t.string 'state'
      t.decimal 'encoding_progress', precision: 5, scale: 2
      t.datetime 'created_at'
      t.datetime 'updated_at'
      t.string 'encoding_error_message'
      t.string 'thumbnail_file_name'
      t.integer 'width'
      t.integer 'height'
      t.integer 'duration_in_ms'
      t.string 'format'
      t.string 'poster_file_name'
      t.string 'poster_content_type'
      t.string 'thumbnail_content_type'
      t.string 'rights', default: '', null: false
      t.integer 'confirmed_by_id'
      t.text 'output_presences'
      t.integer 'parent_file_id'
      t.string 'parent_file_model_type'
      t.index ['parent_file_id', 'parent_file_model_type'], name: 'index_video_files_on_parent_id_and_parent_model_type'
    end

    create_table 'pageflow_widgets', id: :integer, options: 'ENGINE=InnoDB', force: :cascade do |t|
      t.string 'subject_type'
      t.integer 'subject_id'
      t.string 'type_name'
      t.string 'role'
      t.datetime 'created_at'
      t.datetime 'updated_at'
      t.text 'configuration'
    end
  end
end

# rubocop:enable Metrics/LineLength, Metrics/BlockLength
