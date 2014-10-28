# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20141028125408) do

  create_table "active_admin_comments", force: true do |t|
    t.string   "namespace"
    t.text     "body"
    t.string   "resource_id",   null: false
    t.string   "resource_type", null: false
    t.integer  "author_id"
    t.string   "author_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "active_admin_comments", ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id", using: :btree
  add_index "active_admin_comments", ["namespace"], name: "index_active_admin_comments_on_namespace", using: :btree
  add_index "active_admin_comments", ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id", using: :btree

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
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "default_file_rights", default: "", null: false
    t.string   "landing_page_name",   default: "", null: false
    t.integer  "default_theming_id"
  end

  add_index "pageflow_accounts", ["default_theming_id"], name: "index_pageflow_accounts_on_default_theming_id", using: :btree

  create_table "pageflow_accounts_themes", id: false, force: true do |t|
    t.integer "account_id"
    t.integer "theme_name"
  end

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
    t.integer  "confirmed_by_id"
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
    t.integer  "folder_id"
    t.integer  "theming_id"
  end

  add_index "pageflow_entries", ["account_id"], name: "index_pageflow_entries_on_account_id", using: :btree
  add_index "pageflow_entries", ["folder_id"], name: "index_pageflow_entries_on_folder_id", using: :btree
  add_index "pageflow_entries", ["slug"], name: "index_pageflow_entries_on_slug", unique: true, using: :btree
  add_index "pageflow_entries", ["theming_id"], name: "index_pageflow_entries_on_theming_id", using: :btree

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
    t.string   "title",                       default: "",    null: false
    t.text     "summary"
    t.boolean  "manual_start",                default: false
    t.integer  "restored_from_id"
    t.datetime "frozen_at"
    t.string   "snapshot_type"
    t.string   "home_url",                    default: "",    null: false
    t.boolean  "home_button_enabled",         default: false, null: false
    t.boolean  "emphasize_chapter_beginning", default: false, null: false
  end

  add_index "pageflow_revisions", ["restored_from_id"], name: "index_pageflow_revisions_on_restored_from_id", using: :btree

  create_table "pageflow_themings", force: true do |t|
    t.string   "imprint_link_url"
    t.string   "imprint_link_label"
    t.string   "copyright_link_url"
    t.string   "copyright_link_label"
    t.integer  "account_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "cname",                          default: "",   null: false
    t.string   "theme_name"
    t.string   "home_url",                       default: "",   null: false
    t.boolean  "home_button_enabled_by_default", default: true, null: false
  end

  add_index "pageflow_themings", ["cname"], name: "index_pageflow_themings_on_cname", using: :btree

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
    t.integer  "confirmed_by_id"
  end

  create_table "test_hosted_files", force: true do |t|
    t.integer  "entry_id"
    t.integer  "uploader_id"
    t.string   "state"
    t.string   "rights"
    t.string   "attachment_on_filesystem_file_name"
    t.string   "attachment_on_filesystem_content_type"
    t.integer  "attachment_on_filesystem_file_size",    limit: 8
    t.datetime "attachment_on_filesystem_updated_at"
    t.string   "attachment_on_s3_file_name"
    t.string   "attachment_on_s3_content_type"
    t.integer  "attachment_on_s3_file_size",            limit: 8
    t.datetime "attachment_on_s3_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "test_hosted_files", ["entry_id"], name: "index_test_hosted_files_on_entry_id", using: :btree
  add_index "test_hosted_files", ["uploader_id"], name: "index_test_hosted_files_on_uploader_id", using: :btree

  create_table "test_revision_components", force: true do |t|
    t.integer "revision_id"
    t.integer "perma_id"
    t.string  "text"
  end

  create_table "users", force: true do |t|
    t.string   "email",                  default: "",       null: false
    t.string   "encrypted_password",     default: "",       null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "failed_attempts",        default: 0
    t.datetime "locked_at"
    t.string   "first_name"
    t.string   "last_name"
    t.datetime "suspended_at"
    t.integer  "account_id"
    t.string   "role",                   default: "editor", null: false
  end

  add_index "users", ["account_id"], name: "index_pageflow_users_on_account_id", using: :btree
  add_index "users", ["email"], name: "index_pageflow_users_on_email", unique: true, using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
