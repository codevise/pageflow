require 'spec_helper'

module Pageflow
  describe AccountMemberQuery do
    describe AccountMemberQuery::Scope do
      describe '.with_role_at_least' do
        it 'includes members with account membership with required role' do
          user = create(:user)
          account = create(:account, with_previewer: user)

          result = AccountMemberQuery::Scope.new(account)
                                            .with_role_at_least(:previewer)

          expect(result).to include(user)
        end

        it 'includes members with account membership with stronger role' do
          user = create(:user)
          account = create(:account, with_editor: user)

          result = AccountMemberQuery::Scope.new(account)
                                            .with_role_at_least(:previewer)

          expect(result).to include(user)
        end

        it 'does not include members with account membership with ' \
           'insufficient role' do
          user = create(:user)
          account = create(:account, with_member: user)

          result = AccountMemberQuery::Scope.new(account)
                                            .with_role_at_least(:previewer)

          expect(result).not_to include(user)
        end

        it 'does not include members with required role on other account' do
          user = create(:user)
          account = create(:account, with_member: user)
          create(:account, with_previewer: user)

          result = AccountMemberQuery::Scope.new(account)
                                            .with_role_at_least(:previewer)

          expect(result).not_to include(user)
        end

        it 'does not include members with required role on entry of account' do
          user = create(:user)
          account = create(:account, with_member: user)
          create(:entry, with_previewer: user)

          result = AccountMemberQuery::Scope.new(account)
                                            .with_role_at_least(:previewer)

          expect(result).not_to include(user)
        end
      end
    end
  end
end
