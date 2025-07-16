module Pageflow
  module Admin
    # @api private
    class CustomScopesRenderer < ActiveAdmin::Views::Scopes
      builder_method :custom_scopes_renderer

      def build(scopes, options = {})
        @default_scope = options.delete(:default_scope)
        super
      end

      def current_scope?(scope)
        if params[:scope]
          params[:scope] == scope.id
        else
          @default_scope.to_s == scope.id
        end
      end
    end
  end
end
