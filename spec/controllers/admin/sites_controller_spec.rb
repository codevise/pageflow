require 'spec_helper'

module Admin
  describe SitesController do
    render_views

    describe '#index' do
      it 'redirects to account page' do
        admin = create(:user, :admin)
        sign_in(admin, scope: :user)
        site = create(:site)

        get(:index,
            params: {
              id: site
            })

        expect(response)
          .to redirect_to(admin_account_path(id: site.account))
      end
    end

    describe '#edit' do
      it 'does not display inputs for all fields' do
        site = create(:site)

        sign_in(create(:user, :admin), scope: :user)
        get(:edit, params: {id: site})

        expect(response.body).not_to have_selector('[name="site[account_id]"]')
      end

      it 'displays additional registered site form inputs' do
        site = create(:site)

        pageflow_configure do |config|
          config.admin_form_inputs.register(:site, :custom_field)
        end

        sign_in(create(:user, :admin), scope: :user)
        get(:edit, params: {id: site})

        expect(response.body).to have_selector('[name="site[custom_field]"]')
      end
    end

    describe '#update' do
      it 'updates attributes' do
        site = create(:site)

        sign_in(create(:user, :admin), scope: :user)
        put(:update,
            params: {
              id: site.id,
              site: {
                imprint_link_url: 'http://example.com/new'
              }
            })

        expect(site.reload.imprint_link_url).to eq('http://example.com/new')
      end

      it 'does not update sites with insufficient privileges ' do
        site = create(:site, imprint_link_url: 'http://example.com/old')

        sign_in(create(:user, :manager, on: create(:account)), scope: :user)
        put(:update,
            params: {
              id: site.id,
              site: {
                imprint_link_url: 'http://example.com/new'
              }
            })

        expect(flash[:error]).to be_present
        expect(site.reload.imprint_link_url).to eq('http://example.com/old')
      end

      it 'does not allow updating account' do
        site = create(:site)
        account = create(:account)

        sign_in(create(:user, :admin), scope: :user)
        put(:update,
            params: {
              id: site.id,
              site: {
                account_id: account.id
              }
            })

        expect(site.reload.account).not_to eq(account)
      end

      it 'updates custom field registered as form input' do
        site = create(:site)

        pageflow_configure do |config|
          config.admin_form_inputs.register(:site, :custom_field)
        end

        sign_in(create(:user, :admin), scope: :user)
        patch(:update,
              params: {
                id: site,
                site: {
                  custom_field: 'some value'
                }
              })

        expect(site.reload.custom_field).to eq('some value')
      end

      it 'does not update custom field not registered as form input' do
        site = create(:site)

        sign_in(create(:user, :admin), scope: :user)
        patch(:update,
              params: {
                id: site,
                site: {
                  custom_field: 'some value'
                }
              })

        expect(site.reload.custom_field).to eq(nil)
      end
    end
  end
end
