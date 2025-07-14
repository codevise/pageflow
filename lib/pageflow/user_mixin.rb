module Pageflow
  # ActiveRecord related functionality of the Pageflow users.
  module UserMixin
    extend ActiveSupport::Concern

    include Suspendable

    included do
      has_many :memberships, dependent: :destroy, class_name: 'Pageflow::Membership'
      has_many :account_memberships,
               -> { where(entity_type: 'Pageflow::Account') },
               class_name: 'Pageflow::Membership'
      has_many :entries,
               through: :memberships,
               class_name: 'Pageflow::Entry',
               source: :entity,
               source_type: 'Pageflow::Entry'
      has_many :accounts,
               through: :memberships,
               class_name: 'Pageflow::Account',
               source: :entity,
               source_type: 'Pageflow::Account'

      has_many :revisions, class_name: 'Pageflow::Revision', foreign_key: :creator_id

      validates :first_name, :last_name, presence: true
      validates_inclusion_of :locale, in: Pageflow.config.available_locales.map(&:to_s)

      scope :admins, -> { where(admin: true) }
    end

    def admin?
      admin
    end

    def full_name
      [first_name, last_name].join(' ')
    end

    def formal_name
      [last_name, first_name].join(', ')
    end

    def locale
      super.presence || I18n.default_locale.to_s
    end

    def update_with_password(attributes)
      if needs_password?(attributes)
        super(attributes)
      else
        # remove the virtual current_password attribute update_without_password
        # doesn't know how to ignore it
        update_without_password(attributes.except(:current_password))
      end
    end

    def destroy_with_password(password)
      if valid_password?(password)
        destroy
        true
      else
        errors.add(:current_password, password.blank? ? :blank : :invalid)
        false
      end
    end

    # Configure devise to send emails using ActiveJob.
    def send_devise_notification(notification, *args)
      devise_mailer.send(notification, self, *args).deliver_later
    end

    module ClassMethods
      def ransackable_attributes(_auth_object = nil)
        %w[first_name last_name email]
      end
    end

    private

    def needs_password?(attributes)
      attributes[:password].present?
    end
  end
end
