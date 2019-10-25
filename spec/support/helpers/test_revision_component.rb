module Pageflow
  class TestRevisionComponent < ActiveRecord::Base
    include RevisionComponent
    self.table_name = :test_revision_components

    before_save do
      @during_save_transaction_block&.call
    end

    def during_save_transaction(&block)
      @during_save_transaction_block = block
    end

    def self.register(config)
      page_type = TestPageType.new(name: :test,
                                   revision_components: [TestRevisionComponent])

      config.page_types.register(page_type)
    end
  end
end
