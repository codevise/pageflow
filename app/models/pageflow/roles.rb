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
  end
end
