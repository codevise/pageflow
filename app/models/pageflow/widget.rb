module Pageflow
  class Widget < ApplicationRecord
    include SerializedConfiguration

    belongs_to :subject, polymorphic: true, touch: true

    validates :subject, presence: true

    attr_accessor :widget_type

    def copy_to(subject)
      record = dup
      record.subject = subject
      record.save!
    end

    def matches?(options)
      enabled_for_scope?(options[:scope]) &&
        for_insert_point?(options.fetch(:insert_point, :any))
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

    private

    def enabled_for_scope?(scope)
      if scope == :editor
        widget_type.enabled_in_editor?
      elsif scope == :preview
        widget_type.enabled_in_preview?
      else
        true
      end
    end

    def for_insert_point?(insert_point)
      insert_point == :any || widget_type.insert_point == insert_point
    end

    Resolver = Struct.new(:config, :options) do
      def result
        assign_widget_types(all).select do |widget|
          widget.matches?(options)
        end
      end

      private

      def all
        initial_widgets = placeholders_by_role.merge(defaults_by_role)
        initial_widgets.merge(from_db_by_role) { |_role_key, old_val, new_val|
          if old_val.configuration.present?
            new_val.configuration = {} if new_val.configuration.nil?
            new_val.configuration = old_val.configuration.merge(new_val.configuration)
          end
          new_val
        }.values
      end

      def from_db_by_role
        reject_unknown_widget_types(Widget.all)
          .index_by(&:role)
      end

      def reject_unknown_widget_types(widgets)
        widgets.select do |widget|
          widget.type_name.blank? ||
            config.widget_types.type_name?(widget.type_name)
        end
      end

      def defaults_by_role
        config.widget_types.defaults_by_role.each_with_object({}) do |(role, widget_type), result|
          result[role] = Widget.new(role:, type_name: widget_type.name,
                                    subject: nil,
                                    configuration:
                                      config.widget_types.default_configuration(role))
        end
      end

      def placeholders_by_role
        return {} unless options[:include_placeholders]

        config.widget_types.roles.each_with_object({}) do |role, result|
          result[role] = Widget.new(role:, type_name: nil, subject: nil)
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
