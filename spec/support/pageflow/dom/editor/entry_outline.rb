module Pageflow
  module Dom
    module Editor
      class EntryOutline < Domino
        selector 'sidebar .chapters.outline'

        def self.await!
          find!
        end
      end
    end
  end
end
