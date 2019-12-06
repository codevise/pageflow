module Pageflow
  class TestRevisionComponent < ActiveRecord::Base
    include RevisionComponent
    self.table_name = :test_revision_components
  end
end
