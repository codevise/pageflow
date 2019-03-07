require 'spec_helper'

require 'pageflow/lint'

module Pageflow
  Pageflow::Lint.page_type(BuiltInPageType.plain)
  Pageflow::Lint.page_type(BuiltInPageType.video)
  Pageflow::Lint.page_type(BuiltInPageType.audio)
end
