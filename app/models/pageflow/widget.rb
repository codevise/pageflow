module Pageflow
  class Widget < ActiveRecord::Base
    belongs_to :subject, polymorphic: true, touch: true

    validates :subject, presence: true

    attr_accessor :widget_type

    serialize :configuration, JSON

    def configuration
      super || {}
    end

    def copy_to(subject)
      record = dup
      record.subject = subject
      record.save!
    end

    def enabled?(options)
      if options[:scope] == :editor
        widget_type.enabled_in_editor?
      elsif options[:scope] == :preview
        widget_type.enabled_in_preview?
      else
        true
      end
    end

    def self.copy_all_to(subject)
      all.each do |widget|
        widget.copy_to(subject)
      end
    end

    def self.batch_update!(widgets_attributes)
      widgets_attributes.each do |attributes|
        find_or_initialize_by(role: attributes[:role]).update!(attributes)
      end
    end

    def self.resolve(config, options = {})
      Resolver.new(config, options).result
    end

    Resolver = Struct.new(:config, :options) do
      def result
        assign_widget_types(all).select do |widget|
          widget.enabled?(options)
        end
      end

      private

      def all
        placeholders_by_role
          .merge(defaults_by_role)
          .merge(from_db_by_role)
          .values
      end

      def from_db_by_role
        Widget.all.index_by(&:role)
      end

      def defaults_by_role
        config.widget_types.defaults_by_role.each_with_object({}) do |(role, widget_type), result|
          result[role] = Widget.new(role: role, type_name: widget_type.name, subject: nil)
        end
      end

      def placeholders_by_role
        return {} unless options[:include_placeholders]

        config.widget_types.roles.each_with_object({}) do |role, result|
          result[role] = Widget.new(role: role, type_name: nil, subject: nil)
        end
      end

      def assign_widget_types(widgets)
        widgets.each do |widget|
          widget.widget_type = config.widget_types.fetch_by_name(widget.type_name) do
            WidgetType::Null.new(widget.role)
          end
        end
      end
    end
  end
end
