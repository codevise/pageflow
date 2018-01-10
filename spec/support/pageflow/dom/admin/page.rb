module Pageflow
  module Dom
    module Admin
      # @api private
      class Page < Domino
        selector 'body.active_admin'

        attribute :title

        def has_signed_in_user?
          page.has_css?('#current_user')
        end

        def self.sign_out
          visit '/admin/logout'
        end

        def self.sign_in(options)
          visit '/admin/login'
          SignInForm.first.submit_with(options)
        end

        def self.sign_in_as(role, options = {})
          email = "#{role}@example.com"
          password = '!Pass123'
          user = FactoryBot.create(:user, options.reverse_merge(email: email, password: password))

          if role.to_sym == :admin
            user.admin = true
            user.save
          else
            FactoryBot.create(:membership, user: user, role: role, entity: options[:on])
          end

          visit '/admin/login'
          SignInForm.find!.submit_with(email: email, password: password)

          unless page.has_content?(I18n.t('devise.sessions.signed_in'))
            raise 'Expected to find sign in flash message.'
          end

          user
        end

        def self.accessible_with?(options)
          sign_out
          sign_in(options)

          Page.first.has_signed_in_user?
        end
      end
    end
  end
end
