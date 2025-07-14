module Pageflow
  module Admin
    module MembershipsHelper
      def membership_user_select(f, parent)
        if f.object.persisted?
          membership_disabled_select(f, :user, f.object.user, :formal_name)
        elsif parent.is_a?(User)
          membership_disabled_select(f, :user, parent, :formal_name)
        else
          parent_type = parent.class.model_name.singular_route_key
          membership_select(f, :user, parent, :"potential_users_for_#{parent_type}")
        end
      end

      def membership_entity_select(f, parent, entity_type)
        if entity_type == 'Pageflow::Entry'
          membership_entry_select(f, parent)
        else
          membership_account_select(f, parent)
        end
      end

      def membership_roles_collection(entity_type)
        default_options = [[I18n.t('pageflow.admin.users.roles.previewer'), :previewer],
                           [I18n.t('pageflow.admin.users.roles.editor'), :editor],
                           [I18n.t('pageflow.admin.users.roles.publisher'), :publisher],
                           [I18n.t('pageflow.admin.users.roles.manager'), :manager]]

        if entity_type == 'Pageflow::Account'
          [[I18n.t('pageflow.admin.users.roles.member'), :member]] + default_options
        else
          default_options
        end
      end

      private

      def membership_entry_select(f, parent)
        if f.object.persisted?
          membership_disabled_select(f, :entity, f.object.entity, :title)
        elsif parent.is_a?(Entry)
          membership_disabled_select(f, :entity, parent, :title)
        else
          membership_select(f, :entry, parent, :potential_entries_for_user)
        end
      end

      def membership_account_select(f, parent)
        if f.object.persisted?
          membership_disabled_select(f, :entity, f.object.entity, :name)
        elsif parent.is_a?(Account)
          membership_disabled_select(f, :entity, parent, :name)
        else
          membership_select(f, :entity, parent, :potential_accounts_for_user)
        end
      end

      def membership_select(f, name, parent, collection_name)
        f.input(name,
                as: :searchable_select,
                ajax: {resource: Membership,
                       collection_name:,
                       params: {parent_id: parent.id}},
                include_blank: false)
      end

      def membership_disabled_select(f, name, record, text_method)
        f.input(name,
                as: :searchable_select,
                collection: [[record.send(text_method), record.id]],
                include_blank: false,
                input_html: {disabled: true})
      end
    end
  end
end
