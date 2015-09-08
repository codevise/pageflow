module Pageflow
  class FilesController < Pageflow::ApplicationController
    include PublicHttpsMode

    before_filter :check_public_https_mode

    def show
      respond_to do |format|
        format.html do
          entry = PublishedEntry.find(params[:entry_id], entry_request_scope)
          @file = entry.files(file_type.model).find(params[:id])
        end
      end
    end

    protected

    def file_type
      @file_type ||= Pageflow.config.file_types.find_by_collection_name!(params[:collection_name])
    end

    def entry_request_scope
      Pageflow.config.public_entry_request_scope.call(Entry, request)
    end
  end
end
