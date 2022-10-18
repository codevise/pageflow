module Pageflow
  # @api private
  class FeedsController < Pageflow::ApplicationController

    def index
      respond_to do |format|
        format.html
        format.atom
      end
    end
  end
end
