module Pageflow
  module Roles
    module_function

    def at_least(role)
      if role == :member
        %w(member previewer editor publisher manager)
      elsif role == :previewer
        %w(previewer editor publisher manager)
      elsif role == :editor
        %w(editor publisher manager)
      elsif role == :publisher
        %w(publisher manager)
      elsif role == :manager
        %w(manager)
      end
    end

    def highest_role_among(memberships)
      memberships.load
      if memberships.as_manager.any?
        :manager
      elsif memberships.as_publisher.any?
        :publisher
      elsif memberships.as_editor.any?
        :editor
      elsif memberships.as_previewer.any?
        :previewer
      else
        :member
      end
    end
  end
end
