require 'pageflow/global_config_api_test_helper'
require 'pageflow/test_page_type'

require 'pageflow/lint/entry_type'
require 'pageflow/lint/file_type'
require 'pageflow/lint/page_type'
require 'pageflow/lint/file_import'

module Pageflow
  # Shared examples providing integration level specs for Pageflow
  # components commonly defined by plugins.
  #
  # @since 13.0
  module Lint
    # Contract specs for page types. Ensure editor fragments render
    # without error.
    #
    # @param entry_type [EntryType] Page type to run specs for
    #
    # @since 15.1
    #
    # @example
    #
    #   require 'spec_helper'
    #   require 'pageflow/lint'
    #
    #   Pageflow::Lint.entry_type(SomePlugin.entry_type)
    def self.entry_type(*args)
      Lint::EntryType.lint(*args)
    end

    # Ensure file type json partials render correctly.
    #
    # @param name [String] File type name to use in spec descriptions
    # @param create_file_type [#call] Proc creating the file type to test
    # @param create_file [#call] Proc creating a fixture file of the
    #   file type
    # @param create_prerequisite_file_types [#call] Proc returning
    #   array of additional file types to register.
    # @param get_prerequisite_files [#call] Proc that takes the file
    #   returned by create_file and returns an array of files that
    #   shall be included in the exported revision during
    #   export/import test.
    #
    # @example
    #
    #   require 'spec_helper'
    #   require 'pageflow/lint'
    #
    #   module SomePlugin
    #     Pageflow::Lint.file_type('some file type',
    #                              create_file_type: -> { SomePlugin.file_type },
    #                              create_file: -> { create(:some_file) })
    #   end
    def self.file_type(*args)
      Lint::FileType.lint(*args)
    end

    # Contract specs for page types
    #
    # @param page_type [PageType] Page type to run specs for
    #
    # @since 13.6
    #
    # @example
    #
    #   require 'spec_helper'
    #   require 'pageflow/lint'
    #
    #   module SomePlugin
    #     Pageflow::Lint.page_type(SomePLugin.page_type)
    #   end
    def self.page_type(*args)
      Lint::PageType.lint(*args)
    end

    # Contracts specs for file import plugin
    # @example
    #
    #   require 'spec_helper'
    #   require 'pageflow/lint'
    #
    #   module SomePlugin
    #     Pageflow::Lint.file_import(SomePLugin.file_import)
    #   end
    def self.file_import(*args)
      Lint::FileImport.lint(*args)
    end
  end
end
