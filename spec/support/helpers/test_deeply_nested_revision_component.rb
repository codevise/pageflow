module Pageflow
  class TestDeeplyNestedRevisionComponent < ActiveRecord::Base
    self.table_name = :test_deeply_nested_revision_components

    include NestedRevisionComponent

    belongs_to :parent, class_name: 'TestNestedRevisionComponent'
  end
end
