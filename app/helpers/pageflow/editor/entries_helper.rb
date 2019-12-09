module Pageflow
  module Editor
    # @api private
    module EntriesHelper
      def editor_entry_type_fragment(entry, fragment_name)
        entry.entry_type.editor_fragment_renderer.send("#{fragment_name}_fragment", entry)
      end
    end
  end
end
