module Pageflow
  class TestRevisionComponent < ActiveRecord::Base
    self.table_name = :test_revision_components

    include RevisionComponent
  end
end
