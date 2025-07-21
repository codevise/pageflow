class AddPermaIdCounterToEntries < ActiveRecord::Migration[7.1]
  PADDING = 100

  def up
    add_column :pageflow_entries, :perma_id_counter, :integer, default: 0, null: false

    max_perma_id = select_max_perma_id
    execute <<~SQL
      UPDATE pageflow_entries SET perma_id_counter = #{max_perma_id + PADDING}
    SQL
  end

  def down
    remove_column :pageflow_entries, :perma_id_counter
  end

  private

  def select_max_perma_id
    connection.tables.map { |table|
      next unless connection.column_exists?(table, :perma_id)

      connection.select_value("SELECT MAX(perma_id) FROM #{table}").to_i
    }.compact.max.to_i
  end
end
