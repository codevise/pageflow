module Pageflow
  module Policies
    class MembershipPolicy
      def initialize(user, membership)
        @user = user
        @membership = membership
      end

      # def create?
      #   if @membership.entity_type == 'Pageflow::Account'
      #     create_for_account?
      #   else
      #     create_for_entry?
      #   end
      # end

      def edit_role?
        if @membership.entity_type == 'Pageflow::Account'
          edit_role_on_account?
        else
          edit_role_on_entry?
        end
      end

      def destroy?
        if @membership.entity_type == 'Pageflow::Account'
          destroy_for_account?
        else
          destroy_for_entry?
        end
      end

      private

      # def create_for_entry?
      #   (@membership.entity.nil? ||
      #    Pageflow::Policies::EntryPolicy.new(user, @membership.entity).add_member_to?) &&

      # end

      # def create_for_account?
      # end

      def edit_role_on_entry?
        Pageflow::Policies::EntryPolicy.new(@user, @membership.entity).edit_role_on?
      end

      def edit_role_on_account?
        Pageflow::Policies::AccountPolicy.new(@user, @membership.entity).edit_role_on?
      end

      def destroy_for_entry?
        Pageflow::Policies::EntryPolicy.new(@user, @membership.entity).destroy_membership_on?
      end

      def destroy_for_account?
        Pageflow::Policies::AccountPolicy.new(@user, @membership.entity).destroy_membership_on?
      end
    end
  end
end
