module Pageflow
  module Policies
    class EntryPolicy
      def initialize(user, entry)
        @user = user
        @entry = entry
      end

      def preview?
        @user.memberships.where(entity: @entry, role: ['previewer', 'editor', 'publisher', 'manager']).any? ||
          @user.memberships.where(entity: @entry.account, role: ['previewer', 'editor', 'publisher', 'manager']).any?
      end

      def edit?
        @user.memberships.where(entity: @entry, role: ['editor', 'publisher', 'manager']).any? ||
          @user.memberships.where(entity: @entry.account, role: ['editor', 'publisher', 'manager']).any?
      end

      def publish?
        @user.memberships.where(entity: @entry, role: ['publisher', 'manager']).any? ||
          @user.memberships.where(entity: @entry.account, role: ['publisher', 'manager']).any?
      end

      def configure?
        @user.memberships.where(entity: @entry, role: 'manager').any? ||
          @user.memberships.where(entity: @entry.account, role: 'manager').any?
      end
    end
  end
end
