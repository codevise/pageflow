module Pageflow
  class VideoFilesController < Pageflow::ApplicationController
    before_filter :prevent_ssl

    def show
      respond_to do |format|
        format.html do
          entry = PublishedEntry.find(params[:entry_id], entry_request_scope)
          @video_file = entry.video_files.find(params[:id])
        end
      end
    end

    protected

    def entry_request_scope
      Pageflow.config.public_entry_request_scope.call(Entry, request)
    end
  end
end
