module Pageflow
  class RevisionsController < Pageflow::ApplicationController
    include ControllerDelegation
    include QuotaVerification

    before_action :authenticate_user!, except: [:stylesheet]

    respond_to :json

    def show
      revision = Revision.find(params[:id])
      authorize!(:show, revision)

      entry = PublishedEntry.new(revision.entry, revision)
      delegate_to_entry_type_frontend_app!(entry)
    end

    def stylesheet
      revision = Revision.find(params[:id])

      @entry = PublishedEntry.new(revision.entry, revision)

      render template: 'pageflow/entries/stylesheet'
    end

    def depublish_current
      entry = Entry.find(params[:entry_id])
      authorize!(:publish, entry)

      entry.revisions.depublish_all
      redirect_to(main_app.admin_entry_path(entry))
    end

    private

    def revision_params
      params.fetch(:revision, {}).permit(:published_until)
    end

    def delegate_to_entry_type_frontend_app!(entry)
      EntriesControllerEnvHelper.add_entry_info_to_env(request.env, entry:, mode: :preview)
      delegate_to_rack_app!(entry.entry_type.frontend_app)
    end
  end
end
