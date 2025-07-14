module Pageflow
  ActiveAdmin.register Revision, as: 'Revision' do
    menu false

    actions :edit, :update, :show

    form partial: 'form'

    member_action :restore, method: :post do
      revision = Revision.find(params[:id])
      entry = revision.entry
      authorize!(:restore, entry)

      entry.edit_lock.acquire(current_user)
      revision.entry.restore(revision:, creator: current_user)
      entry.edit_lock.release(current_user)
      redirect_to(admin_entry_path(entry), notice: I18n.t('pageflow.admin.revisions.restored'))
    end

    controller do
      include EditLocking

      helper Admin::FormHelper

      def permitted_params
        params.permit(revision: [:published_until])
      end

      def show
        redirect_to([:admin, resource.entry])
      end
    end
  end
end
