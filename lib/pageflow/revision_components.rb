module Pageflow
  class RevisionComponents # rubocop:todo Style/Documentation
    include Enumerable

    def initialize
      @revision_components = []
      @create_defaults_hooks = []
      @after_copy_hooks = []
    end

    def register(revision_component, create_defaults: false, after_copy: false)
      return if @revision_components.include?(revision_component)

      @revision_components << revision_component

      if create_defaults
        @create_defaults_hooks << ->(revision) { revision_component.create_defaults(revision) }
      end

      return unless after_copy

      @after_copy_hooks << lambda do |revision, purpose|
        revision_component.after_copy(revision, purpose:)
      end
    end

    def each(&)
      @revision_components.each(&)
    end

    def create_defaults(revision)
      @create_defaults_hooks.each { |hook| hook.call(revision) }
    end

    def after_copy(revision, purpose:)
      @after_copy_hooks.each { |hook| hook.call(revision, purpose) }
    end
  end
end
