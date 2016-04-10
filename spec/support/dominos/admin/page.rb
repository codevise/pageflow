module Dom
  module Admin
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
        on = if role == :account_manager && options[:on].blank?
               FactoryGirl.create(:account)
             else
               options.delete(:on)
             end

        if [:previewer, :editor, :publisher, :manager].include?(role.to_sym) &&
           !(role == :editor && on.blank?)
          user = FactoryGirl.create(:user, options.reverse_merge(email: email,
                                                                 password: password))
        else
          user = FactoryGirl.create(:user, role, options.reverse_merge(email: email,
                                                                       password: password))
        end

        if on.present?
          role = 'manager' if role == :account_manager
          FactoryGirl.create(:membership, user: user, role: role, entity: on)
        end

        visit '/admin/login'
        SignInForm.first.submit_with(email: email, password: password)

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
