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
      def build_new_resource
        super.tap do |folder|
          folder.account ||= current_user.accounts.first || Account.first
        end
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
        result = params.permit(folder: [:name, :account_id])
        restrict_attributes(result[:folder]) if result[:folder]
        result
      end

      private

      def restrict_attributes(attributes)
        if params[:folder] && params[:folder][:account_id] &&
           AccountPolicy::Scope.new(current_user, Account).folder_addable.map(&:id)
             .include?(params[:folder][:account_id].to_i) &&
           action_name == :create
          attributes
        else
          attributes.except!(:account_id)
        end
      end
    end
  end
end
