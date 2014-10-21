class CreateTestHostedFile < ActiveRecord::Migration
  def change
    create_table :test_hosted_files do |t|
      Pageflow::HostedFile.columns(t)
    end
  end
end
