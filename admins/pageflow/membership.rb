module Pageflow
  ActiveAdmin.register Membership, :as => 'Membership' do
    menu false

    actions :new, :create, :edit, :update, :destroy

    form :partial => 'form'

    controller do
      belongs_to :entry, :parent_class => Pageflow::Entry, :polymorphic => true
      belongs_to :account, parent_class: Pageflow::Account, polymorphic: true
      belongs_to :user, :parent_class => User, :polymorphic => true

      helper Pageflow::Admin::MembershipsHelper
      helper Pageflow::Admin::FormHelper

      def permitted_params
        params.permit(:membership => [:user_id, :entity_id, :entity_type, :role])
      end
    end
  end
end
