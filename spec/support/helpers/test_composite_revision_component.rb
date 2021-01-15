module Pageflow
  class TestCompositeRevisionComponent < ActiveRecord::Base
    self.table_name = :test_revision_components

    include RevisionComponent

    has_many :items, class_name: 'TestNestedRevisionComponent', foreign_key: :parent_id

    nested_revision_components :items
  end
end
