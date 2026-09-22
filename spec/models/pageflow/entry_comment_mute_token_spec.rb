require 'spec_helper'

module Pageflow
  describe EntryCommentMuteToken do
    it 'finds the user and entry the token was generated for' do
      user = create(:user)
      entry = create(:entry)

      expect(EntryCommentMuteToken.find(EntryCommentMuteToken.generate(user:, entry:)))
        .to eq([user, entry])
    end

    it 'finds nothing for a made up token' do
      expect(EntryCommentMuteToken.find('made-up')).to be_nil
    end

    it 'finds nothing for a blank token' do
      expect(EntryCommentMuteToken.find(nil)).to be_nil
    end

    it 'finds nothing for a token signed for another purpose' do
      user = create(:user)
      entry = create(:entry)
      token = Rails.application.message_verifier('other').generate([user.id, entry.id])

      expect(EntryCommentMuteToken.find(token)).to be_nil
    end

    it 'finds nothing once the token has expired' do
      token = EntryCommentMuteToken.generate(user: create(:user), entry: create(:entry))

      Timecop.travel(EntryCommentMuteToken::EXPIRES_IN.from_now + 1.day) do
        expect(EntryCommentMuteToken.find(token)).to be_nil
      end
    end

    it 'finds nothing once the entry is gone' do
      entry = create(:entry)
      token = EntryCommentMuteToken.generate(user: create(:user), entry:)
      entry.destroy

      expect(EntryCommentMuteToken.find(token)).to be_nil
    end

    it 'finds nothing once the user is gone' do
      user = create(:user)
      token = EntryCommentMuteToken.generate(user:, entry: create(:entry))
      user.destroy

      expect(EntryCommentMuteToken.find(token)).to be_nil
    end
  end
end
