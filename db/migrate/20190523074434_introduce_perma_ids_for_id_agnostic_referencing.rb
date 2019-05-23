class IntroducePermaIdsForIdAgnosticReferencing < ActiveRecord::Migration[5.2]
  def up
    %w(audio image text_track video).each do |uploaded_file_type|
      add_column "pageflow_#{uploaded_file_type}_files", :perma_id, :integer, after: 'id'
      add_index :"pageflow_#{uploaded_file_type}_files", :perma_id
      execute("UPDATE pageflow_#{uploaded_file_type}_files SET perma_id = id;")
    end
  end

  def down
    %w(audio image text_track video).each do |uploaded_file_type|
      remove_column "pageflow_#{uploaded_file_type}_files", :perma_id
    end
  end
end
