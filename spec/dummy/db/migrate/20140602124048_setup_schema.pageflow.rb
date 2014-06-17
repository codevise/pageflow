# This migration comes from pageflow (originally 20140418225525)
class SetupSchema < ActiveRecord::Migration
  def change
    create_table "friendly_id_slugs", force: true do |t|
      t.string   "slug",                      null: false
      t.integer  "sluggable_id",              null: false
      t.string   "sluggable_type", limit: 50
      t.string   "scope"
      t.datetime "created_at"
    end

    add_index "friendly_id_slugs", ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true, using: :btree
    add_index "friendly_id_slugs", ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type", using: :btree
    add_index "friendly_id_slugs", ["sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_id", using: :btree
    add_index "friendly_id_slugs", ["sluggable_type"], name: "index_friendly_id_slugs_on_sluggable_type", using: :btree

    create_table "pageflow_accounts", force: true do |t|
      t.string   "name",                default: "", null: false
      t.integer  "default_theme_id"
      t.datetime "created_at"
      t.datetime "updated_at"
      t.string   "default_file_rights", default: "", null: false
      t.string   "cname",               default: "", null: false
      t.string   "landing_page_name",   default: "", null: false
    end

    add_index "pageflow_accounts", ["cname"], name: "index_pageflow_accounts_on_cname", using: :btree

    create_table "pageflow_audio_files", force: true do |t|
      t.integer  "entry_id"
      t.integer  "uploader_id"
      t.string   "attachment_on_filesystem_file_name"
      t.string   "attachment_on_filesystem_content_type"
      t.integer  "attachment_on_filesystem_file_size",    limit: 8
      t.datetime "attachment_on_filesystem_updated_at"
      t.string   "attachment_on_s3_file_name"
      t.string   "attachment_on_s3_content_type"
      t.integer  "attachment_on_s3_file_size",            limit: 8
      t.datetime "attachment_on_s3_updated_at"
      t.integer  "job_id"
      t.string   "state"
      t.decimal  "encoding_progress",                               precision: 5, scale: 2
      t.datetime "created_at"
      t.datetime "updated_at"
      t.string   "encoding_error_message"
      t.integer  "duration_in_ms"
      t.string   "format"
      t.string   "rights",                                                                  default: "", null: false
    end

    create_table "pageflow_chapters", force: true do |t|
      t.integer  "entry_id"
      t.datetime "created_at"
      t.datetime "updated_at"
      t.integer  "position",    default: 0,  null: false
      t.string   "title",       default: "", null: false
      t.integer  "revision_id"
    end

    add_index "pageflow_chapters", ["entry_id"], name: "index_pageflow_chapters_on_entry_id", using: :btree
    add_index "pageflow_chapters", ["revision_id"], name: "index_pageflow_chapters_on_revision_id", using: :btree

    create_table "pageflow_edit_locks", force: true do |t|
      t.integer  "user_id"
      t.integer  "entry_id"
      t.datetime "created_at"
      t.datetime "updated_at"
    end

    add_index "pageflow_edit_locks", ["entry_id"], name: "index_pageflow_edit_locks_on_entry_id", using: :btree
    add_index "pageflow_edit_locks", ["user_id"], name: "index_pageflow_edit_locks_on_user_id", using: :btree

    create_table "pageflow_entries", force: true do |t|
      t.string   "title",      default: "", null: false
      t.datetime "created_at"
      t.datetime "updated_at"
      t.string   "slug",                    null: false
      t.integer  "account_id"
      t.integer  "theme_id"
      t.integer  "folder_id"
    end

    add_index "pageflow_entries", ["account_id"], name: "index_pageflow_entries_on_account_id", using: :btree
    add_index "pageflow_entries", ["folder_id"], name: "index_pageflow_entries_on_folder_id", using: :btree
    add_index "pageflow_entries", ["slug"], name: "index_pageflow_entries_on_slug", unique: true, using: :btree
    add_index "pageflow_entries", ["theme_id"], name: "index_pageflow_entries_on_theme_id", using: :btree

    create_table "pageflow_file_usages", force: true do |t|
      t.integer  "revision_id"
      t.integer  "file_id"
      t.string   "file_type"
      t.datetime "created_at"
      t.datetime "updated_at"
    end

    add_index "pageflow_file_usages", ["file_id", "file_type"], name: "index_pageflow_file_usages_on_file_id_and_file_type", using: :btree
    add_index "pageflow_file_usages", ["revision_id"], name: "index_pageflow_file_usages_on_revision_id", using: :btree

    create_table "pageflow_folders", force: true do |t|
      t.string   "name"
      t.integer  "account_id"
      t.datetime "created_at"
      t.datetime "updated_at"
    end

    add_index "pageflow_folders", ["account_id"], name: "index_pageflow_folders_on_account_id", using: :btree

    create_table "pageflow_image_files", force: true do |t|
      t.integer  "entry_id"
      t.integer  "uploader_id"
      t.string   "unprocessed_attachment_file_name"
      t.string   "unprocessed_attachment_content_type"
      t.integer  "unprocessed_attachment_file_size",    limit: 8
      t.datetime "unprocessed_attachment_updated_at"
      t.string   "processed_attachment_file_name"
      t.string   "processed_attachment_content_type"
      t.integer  "processed_attachment_file_size",      limit: 8
      t.datetime "processed_attachment_updated_at"
      t.string   "state"
      t.datetime "created_at"
      t.datetime "updated_at"
      t.integer  "width"
      t.integer  "height"
      t.string   "rights",                                        default: "", null: false
    end

    create_table "pageflow_memberships", force: true do |t|
      t.integer  "user_id"
      t.integer  "entry_id"
      t.string   "name"
      t.datetime "created_at"
      t.datetime "updated_at"
    end

    add_index "pageflow_memberships", ["entry_id"], name: "index_pageflow_memberships_on_entry_id", using: :btree
    add_index "pageflow_memberships", ["user_id"], name: "index_pageflow_memberships_on_user_id", using: :btree

    create_table "pageflow_pages", force: true do |t|
      t.integer  "chapter_id"
      t.string   "template",              default: "",   null: false
      t.text     "configuration"
      t.datetime "created_at"
      t.datetime "updated_at"
      t.integer  "position",              default: 0,    null: false
      t.boolean  "display_in_navigation", default: true
      t.integer  "perma_id"
    end

    add_index "pageflow_pages", ["chapter_id"], name: "index_pageflow_pages_on_chapter_id", using: :btree
    add_index "pageflow_pages", ["perma_id"], name: "index_pageflow_pages_on_perma_id", using: :btree

    create_table "pageflow_revisions", force: true do |t|
      t.integer  "entry_id"
      t.integer  "creator_id"
      t.datetime "published_at"
      t.datetime "published_until"
      t.datetime "created_at"
      t.datetime "updated_at"
      t.text     "credits"
      t.string   "title",            default: "",    null: false
      t.text     "summary"
      t.boolean  "manual_start",     default: false
      t.integer  "restored_from_id"
      t.datetime "frozen_at"
      t.string   "snapshot_type"
    end

    add_index "pageflow_revisions", ["restored_from_id"], name: "index_pageflow_revisions_on_restored_from_id", using: :btree

    create_table "pageflow_themes", force: true do |t|
      t.string   "name",                 default: "", null: false
      t.datetime "created_at"
      t.datetime "updated_at"
      t.string   "imprint_link_url"
      t.string   "imprint_link_label"
      t.string   "copyright_link_url"
      t.string   "copyright_link_label"
    end

    create_table "pageflow_video_files", force: true do |t|
      t.integer  "entry_id"
      t.integer  "uploader_id"
      t.string   "attachment_on_filesystem_file_name"
      t.string   "attachment_on_filesystem_content_type"
      t.integer  "attachment_on_filesystem_file_size",    limit: 8
      t.datetime "attachment_on_filesystem_updated_at"
      t.string   "attachment_on_s3_file_name"
      t.string   "attachment_on_s3_content_type"
      t.integer  "attachment_on_s3_file_size",            limit: 8
      t.datetime "attachment_on_s3_updated_at"
      t.integer  "job_id"
      t.string   "state"
      t.decimal  "encoding_progress",                               precision: 5, scale: 2
      t.datetime "created_at"
      t.datetime "updated_at"
      t.string   "encoding_error_message"
      t.string   "thumbnail_file_name"
      t.integer  "width"
      t.integer  "height"
      t.integer  "duration_in_ms"
      t.string   "format"
      t.string   "poster_file_name"
      t.string   "poster_content_type"
      t.string   "thumbnail_content_type"
      t.string   "rights",                                                                  default: "", null: false
    end
  end
end
