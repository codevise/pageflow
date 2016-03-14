require 'spec_helper'

module Pageflow
  describe Editor::FileUsagesController do
    routes { Engine.routes }
    render_views

    describe '#create' do
      it 'creates file usage for draft of given entry' do
        user = create(:user, :editor)
        entry = create(:entry, :with_member => user)
        other_entry = create(:entry, :with_member => user)
        file = create(:image_file)
        create(:file_usage, :revision => other_entry.draft, :file => file)

        sign_in(user)
        post(:create, :entry_id => entry.id, :file_usage => {:file_id => file.id, :file_type => 'Pageflow::ImageFile'}, :format => 'json')

        expect(entry.draft.image_files).to include(file)
      end

      it 'cannot add file of unaccessible entry' do
        user = create(:user, :editor)
        entry = create(:entry, :with_member => user)
        other_entry = create(:entry)
        file = create(:image_file)
        create(:file_usage, :revision => other_entry.draft, :file => file)

        sign_in(user)
        post(:create, :entry_id => entry.id, :file_usage => {:file_id => file.id, :file_type => 'Pageflow::ImageFile'}, :format => 'json')

        expect(response.status).to eq(403)
      end

      it 'cannot add file to unaccessible entry' do
        user = create(:user, :editor)
        entry = create(:entry)
        other_entry = create(:entry, :with_member => user)
        file = create(:image_file)
        create(:file_usage, :revision => other_entry.draft, :file => file)

        sign_in(user)
        post(:create, :entry_id => entry.id, :file_usage => {:file_id => file.id, :file_type => 'Pageflow::ImageFile'}, :format => 'json')

        expect(response.status).to eq(403)
      end

      it 'requires user to be signed in' do
        user = create(:user, :editor)
        entry = create(:entry, :with_member => user)
        file = create(:image_file)

        post(:create, :entry_id => entry.id, :file_usage => {:file_id => file.id}, :format => 'json')

        expect(response.status).to eq(401)
      end
    end

    describe '#destroy' do
      it 'destroys a file usage for draft of a given entry' do
        user = create(:user, :editor)
        entry = create(:entry, :with_member => user)
        file = create(:image_file)
        usage = create(:file_usage, :revision => entry.draft, :file => file)

        sign_in(user)
        acquire_edit_lock(user, entry)

        delete(:destroy, :id => usage.id, :format => 'json')

        expect(entry.draft).to have(0).image_files
      end

      it 'cannot remove file from unaccessible entry' do
        user = create(:user, :editor)
        entry = create(:entry)
        file = create(:image_file)
        usage = create(:file_usage, :revision => entry.draft, :file => file)

        sign_in(user)
        acquire_edit_lock(user, entry)

        delete(:destroy, :id => usage.id, :format => 'json')

        expect(response.status).to eq(403)
      end

      it 'requires user to be signed in' do
        user = create(:user, :editor)
        entry = create(:entry, :with_member => user)
        file = create(:image_file)
        usage = create(:file_usage, :revision => entry.draft, :file => file)

        delete(:destroy, :id => usage.id, :format => 'json')

        expect(response.status).to eq(401)
      end

      it 'requires user to have edit lock on entry' do
        user = create(:user, :editor)
        entry = create(:entry, :with_member => user)
        file = create(:image_file)
        usage = create(:file_usage, :revision => entry.draft, :file => file)

        sign_in(user)

        delete(:destroy, :id => usage.id, :format => 'json')

        expect(response.status).to eq(409)
      end
    end
  end
end
