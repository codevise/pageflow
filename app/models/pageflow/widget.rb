module Pageflow
  class Widget < ActiveRecord::Base
    belongs_to :subject, polymorphic: true, touch: true

    validates :subject, presence: true

    def copy_to(subject)
      record = dup
      record.subject = subject
      record.save!
    end

    def enabled?(options)
      options[:only] != :editor || widget_type.enabled_in_editor?
    end

    def widget_type
      Pageflow.config.widget_types.fetch_by_name(type_name) do
        WidgetType::Null.new(role)
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

    def self.resolve(options = {})
      Resolver.new(options).result
    end

    class Resolver < Struct.new(:options)
      def result
        all.select do |widget|
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
        Pageflow.config.widget_types.defaults_by_role.each_with_object({}) do |(role, widget_type), result|
          result[role] = Widget.new(role: role, type_name: widget_type.name, subject: nil)
        end
      end

      def placeholders_by_role
        return {} unless options[:include_placeholders]

        Pageflow.config.widget_types.roles.each_with_object({}) do |role, result|
          result[role] = Widget.new(role: role, type_name: nil, subject: nil)
        end
      end
    end
  end
end
