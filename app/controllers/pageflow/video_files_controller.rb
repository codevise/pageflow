module Pageflow
  class VideoFilesController < Pageflow::ApplicationController
    before_filter :prevent_ssl

    def show
      respond_to do |format|
        format.html do
          entry = PublishedEntry.find(params[:entry_id])
          @video_file = entry.video_files.find(params[:id])
        end
      end
    end
  end
end
