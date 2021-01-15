module Pageflow
  class TestNestedRevisionComponent < ActiveRecord::Base
    self.table_name = :test_nested_revision_components

    include NestedRevisionComponent

    belongs_to :parent, class_name: 'TestCompositeRevisionComponent'
    has_many :items, class_name: 'TestDeeplyNestedRevisionComponent', foreign_key: :parent_id

    nested_revision_components :items
  end
end
