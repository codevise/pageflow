require 'rails/generators'

# Thor exits with 0, when an error occurs. This behavior is deprecated
# in 1.0 [1], but has not yet changed. As a result the dummy app
# generation is not aborted and tests fail due to confusing follow up
# errors. Rails provides an `abort_on_failure` option for `rake` and
# `generate` actions [2], but it needs to be added to each such
# action. In particular, generating the dummy app invokes other
# generators, which we do not have control over.
#
# To work around this problem, we override the default behavior for
# all generators and make them fail loudly.
#
# [1] https://github.com/erikhuda/thor/blob/master/CHANGELOG.md#100
# [2] https://github.com/rails/rails/pull/34420/

module Rails
  module Generators
    class Base
      def self.exit_on_failure?
        true
      end
    end
  end
end
