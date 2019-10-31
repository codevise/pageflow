module Pageflow
  class TestRevisionComponent < ActiveRecord::Base
    include RevisionComponent
    self.table_name = :test_revision_components

    def self.register(config)
      page_type = TestPageType.new(name: :test,
                                   revision_components: [TestRevisionComponent])

      config.page_types.register(page_type)
    end
  end
end
