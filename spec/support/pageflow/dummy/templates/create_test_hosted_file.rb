class CreateTestHostedFile < ActiveRecord::Migration[4.2]
  def change
    create_table :test_hosted_files do |t|
      Pageflow::HostedFile.columns(t)
    end
  end
end
