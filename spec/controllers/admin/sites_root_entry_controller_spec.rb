require 'spec_helper'

module Admin
  describe SiteRootEntryController do
    render_views

    describe 'GET #choose' do
      it 'lists entries of site for account manager' do
        ActiveAdmin::SearchableSelect.inline_ajax_options = true

        account = create(:account)
        site = create(:site, :with_root_permalink_directory, account:)
        other_site_of_account = create(:site, :with_root_permalink_directory, account:)
        entry = create(:entry, site:, account:)
        other_entry = create(:entry, site: other_site_of_account, account:)
        user = create(:user, :manager, on: account)

        sign_in(user)
        get :choose, params: {site_id: site}

        expect(response.status).to eq(200)
        expect(response.body).to have_select('site_root_entry_form[entry_id]',
                                             with_options: [entry.title])
        expect(response.body).not_to have_select('site_root_entry_form[entry_id]',
                                                 with_options: [other_entry.title])
      end

      it 'requires account manager role' do
        account = create(:account)
        site = create(:site, :with_root_permalink_directory, account:)
        user = create(:user, :publisher, on: account)

        sign_in(user)
        get :choose, params: {site_id: site}

        expect(response).to redirect_to(admin_root_path)
        expect(flash[:error]).to be_present
      end

      it 'requires site to have permalink directories' do
        account = create(:account)
        site = create(:site, account:)
        user = create(:user, :manager, on: account)

        sign_in(user)
        get :choose, params: {site_id: site}

        expect(response).to redirect_to(admin_root_path)
        expect(flash[:alert]).to be_present
      end

      it 'requires site not to already have root entry' do
        account = create(:account)
        site = create(:site, account:)
        create(
          :entry,
          account:,
          site:,
          permalink_attributes: {
            allow_root_path: true,
            slug: ''
          }
        )
        user = create(:user, :manager, on: account)

        sign_in(user)
        get :choose, params: {site_id: site}

        expect(response).to redirect_to(admin_root_path)
        expect(flash[:alert]).to be_present
      end
    end

    describe 'POST #choose' do
      it 'turns selected entry into root entry' do
        account = create(:account)
        site = create(:site, :with_root_permalink_directory, account:)
        entry = create(
          :entry,
          :published,
          account:,
          site:,
          permalink_attributes: {
            directory_path: 'en/',
            slug: 'some-slug'
          }
        )
        user = create(:user, :manager, on: account)

        sign_in(user)
        post :choose,
             params: {
               site_id: site,
               site_root_entry_form: {
                 entry_id: entry.id
               }
             }

        expect(response).to redirect_to(admin_entry_path(entry))
        expect(flash[:notice]).to be_present
        expect(entry.permalink.reload).to have_attributes(slug: '')
        expect(entry.permalink.directory).to have_attributes(path: '')
        expect(entry.permalink_redirects.first).to have_attributes(slug: 'some-slug')
      end

      it 'requires account manager role' do
        account = create(:account)
        site = create(:site, :with_root_permalink_directory, account:)
        entry = create(
          :entry,
          account:,
          site:,
          permalink_attributes: {slug: 'some-slug'}
        )
        user = create(:user, :publisher, on: account)

        sign_in(user)
        post :choose,
             params: {
               site_id: site,
               site_root_entry_form: {
                 entry_id: entry.id
               }
             }

        expect(response).to redirect_to(admin_root_path)
        expect(flash[:error]).to be_present
      end

      it 'does not accept entry from other site' do
        account = create(:account)
        site = create(:site, :with_root_permalink_directory, account:)
        other_site = create(:site, :with_root_permalink_directory, account:)
        entry = create(
          :entry,
          :published,
          account:,
          site: other_site,
          permalink_attributes: {
            slug: 'some-slug'
          }
        )
        user = create(:user, :manager, on: account)

        sign_in(user)
        post :choose,
             params: {
               site_id: site,
               site_root_entry_form: {
                 entry_id: entry.id
               }
             }

        expect(response.body).to include('Story not found')
        expect(response.status).to eq(200)
      end
    end
  end
end
