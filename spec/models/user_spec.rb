require 'spec_helper'

describe User do
  describe 'unread_comments_since_at' do
    it 'is set to creation time' do
      user = create(:user)

      expect(user.unread_comments_since_at).to eq(Time.current)
    end

    it 'is not overwritten when given' do
      unread_comments_since_at = 2.hours.ago

      user = create(:user, unread_comments_since_at:)

      expect(user.unread_comments_since_at).to eq(unread_comments_since_at)
    end

    it 'stays put when the user is updated' do
      user = create(:user)

      Timecop.freeze(1.hour.from_now) do
        user.update!(first_name: 'Renamed')
      end

      expect(user.reload.unread_comments_since_at).to eq(user.created_at)
    end
  end
end
