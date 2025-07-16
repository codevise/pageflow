module Pageflow
  module ActiveAdminPatches
    module Views
      module Pages
        # @api private
        module Base
          def build(*args)
            super(*args)
            set_attribute(:lang, I18n.locale)
          end
        end
      end
    end
  end
end
