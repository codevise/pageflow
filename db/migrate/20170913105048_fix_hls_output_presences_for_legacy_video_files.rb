class FixHlsOutputPresencesForLegacyVideoFiles < ActiveRecord::Migration
  def up
    execute(<<-SQL)
      UPDATE pageflow_video_files
        SET output_presences = '{"high":true,"medium":true,"low":true,"hls-playlist":true}'
        WHERE output_presences = '{"high":true,"medium":true,"low":true}';
    SQL
  end

  def down
  end
end
