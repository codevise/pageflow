# create storylines for pageflow scrolled models and remodel
# the hierarchy association accordingly
class CreatePageflowScrolledStorylines < ActiveRecord::Migration[5.2]
  def change
    # storylines are the new top-level revision components
    # they get created lazily whenever the first chapter is created
    create_table :pageflow_scrolled_storylines do |t|
      t.integer :perma_id
      t.references :revision
      t.integer :position, default: 0, null: false
      t.text    :configuration
      t.timestamps
    end

    change_table :pageflow_scrolled_chapters do |t|
      t.references :storyline, after: 'perma_id'
    end

    change_table :pageflow_scrolled_sections do |t|
      t.remove :revision_id
      t.references :chapter, after: 'perma_id'
    end
  end
end
