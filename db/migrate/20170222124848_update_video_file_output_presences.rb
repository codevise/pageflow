class UpdateVideoFileOutputPresences < ActiveRecord::Migration[4.2]
  def up
    execute(<<-SQL)
      UPDATE pageflow_video_files
        SET output_presences = '{"high":true,"medium":true,"low":true,"hls-playlist":true}'
        WHERE output_presences IS NULL;
    SQL
  end

  def down
  end
end
