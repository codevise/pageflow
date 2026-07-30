require 'spec_helper'

module Pageflow
  describe Comment do
    describe 'quote' do
      it 'is stored as given when within the limit' do
        comment = create(:comment, quote: 'quick brown')

        expect(comment.reload.quote).to eq('quick brown')
      end

      it 'is cut to the limit instead of keeping the comment from being saved' do
        comment = create(:comment, quote: 'a' * (Comment::QUOTE_LIMIT + 10))

        expect(comment.reload.quote.length).to eq(Comment::QUOTE_LIMIT)
      end

      it 'is cut without appending an omission marker' do
        comment = create(:comment, quote: "#{'a' * Comment::QUOTE_LIMIT}bcd")

        expect(comment.reload.quote).to eq('a' * Comment::QUOTE_LIMIT)
      end

      it 'stays blank when not given' do
        comment = create(:comment)

        expect(comment.reload.quote).to be_nil
      end
    end
  end
end
