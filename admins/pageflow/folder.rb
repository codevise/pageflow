module Pageflow
  ActiveAdmin.register Folder, as: 'Folder' do
    menu false

    actions :new, :create, :edit, :update, :destroy

    form do |f|
      f.inputs do
        if authorized?(:show_account_selection_on, resource) && f.object.new_record?
          f.input :account,
                  collection: AccountPolicy::Scope.new(current_user, Account).folder_addable,
                  include_blank: false
        end
        f.input :name
      end
      f.actions do
        f.action(:submit)
        f.action(:cancel, wrapper_html: {class: 'cancel'})
      end
    end

    controller do
      after_build do |folder|
        folder.account ||= account_policy_scope.folder_addable.first || Account.first
      end

      def create
        super do |success|
          success.html { redirect_to(admin_entries_path) }
        end
      end

      def update
        super do |success, _failure|
          success.html { redirect_to(admin_entries_path(folder_id: resource.id)) }
        end
      end

      def destroy
        super do |success, _failure|
          success.html { redirect_to(admin_entries_path) }
        end
      end

      def permitted_params
        result = params.permit(folder: [:name, :account_id]).to_h
        restrict_attributes(result[:folder]) if result[:folder]
        result
      end

      private

      def account_policy_scope
        AccountPolicy::Scope.new(current_user, Account)
      end

      def restrict_attributes(attributes)
        if params[:folder] && params[:folder][:account_id] &&
           AccountPolicy::Scope.new(current_user, Account)
            .folder_addable.exists?(params[:folder][:account_id]) &&
           action_name.to_sym == :create

          attributes
        else
          attributes.except!(:account_id)
        end
      end
    end
  end
end
