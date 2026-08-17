module Pageflow
  module Review
    # @api private
    class CommentThreadReadsController < Pageflow::ApplicationController
      respond_to :json
      before_action :authenticate_user!

      def create
        entry = DraftEntry.find(params[:entry_id])
        authorize!(:read, entry.to_model)

        CommentThreadRead.mark(entry: entry.to_model,
                               user: current_user,
                               comment_thread_perma_ids: known_perma_ids(entry))

        head :no_content
      end

      private

      # Guards against read records piling up for comment threads that
      # do not exist in the entry.
      def known_perma_ids(entry)
        entry.comment_threads
             .where(perma_id: params.fetch(:comment_thread_perma_ids, []))
             .pluck(:perma_id)
      end
    end
  end
end
