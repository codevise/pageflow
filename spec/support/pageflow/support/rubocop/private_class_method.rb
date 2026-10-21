module RuboCop
  module Cop
    module Pageflow
      # Disallow `private_class_method`.
      class PrivateClassMethod < Base
        MSG = 'Define private class methods below `private` inside `class << self`.'.freeze

        RESTRICT_ON_SEND = %i[private_class_method].freeze

        def on_send(node)
          add_offense(node)
        end
      end
    end
  end
end
