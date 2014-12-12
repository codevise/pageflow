module Pageflow
  class RevisionsController < Pageflow::ApplicationController
    include QuotaVerification

    before_filter :authenticate_user!, :unless => lambda { |controller| controller.request.format.css? }

    respond_to :json

    def show
      revision = Revision.find(params[:id])
      authorize!(:show, revision) unless request.format.css?

      @entry = PublishedEntry.new(revision.entry, revision)
      I18n.locale = @entry.locale

      render :template => 'pageflow/entries/show'
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
  end
end
