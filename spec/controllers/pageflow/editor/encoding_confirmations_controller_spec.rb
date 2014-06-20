require 'spec_helper'

module Pageflow
  module Editor
    describe EncodingConfirmationsController do
      routes { Engine.routes }
      render_views

      describe '#create' do
        it 'confirms encoding for given video files' do
          user = create(:user)
          entry = create(:entry, with_member: user)
          video_file = create(:video_file, :waiting_for_confirmation, used_in: entry.draft)

          sign_in(user)
          aquire_edit_lock(user, entry)
          post(:create, entry_id: entry.id, encoding_confirmation: {video_file_ids: [video_file.id]}, format: 'json')

          expect(video_file.reload.state).to eq('waiting_for_encoding')
        end

        it 'confirms encoding for given audio files' do
          user = create(:user)
          entry = create(:entry, with_member: user)
          audio_file = create(:audio_file, :waiting_for_confirmation, used_in: entry.draft)

          sign_in(user)
          aquire_edit_lock(user, entry)
          post(:create, entry_id: entry.id, encoding_confirmation: {audio_file_ids: [audio_file.id]}, format: 'json')

          expect(audio_file.reload.state).to eq('waiting_for_encoding')
        end

        it 'does not allow to confirm encoding file of other entry' do
          user = create(:user)
          entry = create(:entry, with_member: user)
          other_entry = create(:entry, with_member: user)
          video_file = create(:video_file, :waiting_for_confirmation, used_in: other_entry.draft)

          sign_in(user)
          post(:create, entry_id: entry.id, encoding_confirmation: {video_file_ids: [video_file.id]}, format: 'json')

          expect(response.status).to eq(404)
        end

        it 'does not allow to confirm encoding of files in entry the signed in user is not member of' do
          user = create(:user)
          entry = create(:entry)
          video_file = create(:video_file, :waiting_for_confirmation, used_in: entry.draft)

          sign_in(user)
          post(:create, entry_id: entry.id, encoding_confirmation: {video_file_ids: [video_file.id]}, format: 'json')

          expect(response.status).to eq(403)
        end

        it 'does not allow to confirm encoding file if not signed in' do
          entry = create(:entry)
          video_file = create(:video_file, :waiting_for_confirmation, used_in: entry.draft)

          post(:create, entry_id: entry.id, encoding_confirmation: {video_file_ids: [video_file.id]}, format: 'json')

          expect(response.status).to eq(401)
        end
      end
    end
  end
end
