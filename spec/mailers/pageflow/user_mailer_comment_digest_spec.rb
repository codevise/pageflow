require 'spec_helper'

module Pageflow
  describe UserMailer do
    describe '#comment_digest' do
      it 'sends from the configured mailer sender' do
        Pageflow.config.mailer_sender = 'test@example.com'

        expect(mail_for(create(:user)).from).to eq(['test@example.com'])
      end

      it 'uses the locale of the receiving user' do
        mail = mail_for(create(:user, locale: 'de'))

        expect(mail.header['X-Language'].value).to eq('de')
      end

      it 'names the entry in the subject' do
        mail = mail_for(create(:user), entry_title: 'Wolves Return')

        expect(mail.subject).to include('Wolves Return')
      end

      it 'links the entry from the opening sentence' do
        entry = create(:entry, title: 'Wolves Return')

        mail = mail_for(create(:user), entry:)

        expect(mail.html_part.body.encoded)
          .to include('>Wolves Return</a>')
      end

      it 'names who wrote the comment and what they wrote' do
        mail = mail_for(create(:user), author_name: 'Ada Lovelace', body: 'Needs a source')

        expect(mail.body.encoded).to include('Ada Lovelace')
        expect(mail.body.encoded).to include('Needs a source')
      end

      it 'summarises the thread above it' do
        mail = mail_for(create(:user))

        expect(mail.body.encoded).to include('Topic started')
      end

      it 'marks where the new replies start' do
        mail = mail_for(create(:user)) do |thread|
          create(:comment, comment_thread: thread, creator: create(:user), body: 'Fixed')
        end

        expect(mail.body.encoded).to include('New replies')
        expect(mail.body.encoded).to include('Fixed')
      end

      it 'counts the replies the recipient has seen already' do
        entry = create(:entry)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user), body: 'A topic')
        create(:comment, comment_thread: thread, creator: create(:user), body: 'Seen')
        create(:comment, comment_thread: thread, creator: create(:user), body: 'New')

        mail = UserMailer.comment_digest(
          digest(create(:user), entry, thread.reload,
                 events: CommentThreadActivity.events(thread).last(1))
        )

        expect(mail.body.encoded).to include('1 earlier reply')
        expect(mail.body.encoded).not_to include('Seen')
      end

      it 'names who resolved the thread' do
        resolver = create(:user, first_name: 'Grace', last_name: 'Hopper')
        entry = create(:entry)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: create(:user))
        thread.update!(resolved_at: Time.current, resolver:)

        mail = UserMailer.comment_digest(digest(create(:user), entry, thread.reload))

        expect(mail.body.encoded).to include('Marked as resolved by')
        expect(mail.body.encoded).to include('Grace Hopper')
      end

      it 'refers to the entry so that clients thread its digests' do
        Pageflow.config.mailer_sender = 'test@example.com'
        entry = create(:entry)

        mail = mail_for(create(:user), entry:)

        expect(mail.header['References'].value).to eq("<pageflow-entry-#{entry.id}@example.com>")
        expect(mail.header['In-Reply-To'].value).to eq("<pageflow-entry-#{entry.id}@example.com>")
      end

      it 'refers to the same parent for two digests of one entry' do
        entry = create(:entry)

        references = [mail_for(create(:user), entry:), mail_for(create(:user), entry:)]
                     .map { |mail| mail.header['References'].value }

        expect(references.uniq.size).to eq(1)
      end

      it 'refers to a different parent for another entry' do
        references = [mail_for(create(:user)), mail_for(create(:user))]
                     .map { |mail| mail.header['References'].value }

        expect(references.uniq.size).to eq(2)
      end

      describe 'footer' do
        it 'explains that every comment in the entry notifies the recipient' do
          user = create(:user)
          entry = create(:entry, with_previewer: user)

          mail = mail_for(user, entry:)

          expect(bodies(mail)).to all(
            include('You are receiving this mail because notifications for all activity in this ' \
                    'story are turned on')
          )
        end

        it 'explains that topics the recipient took part in or watches notify them' do
          mail = mail_for(create(:user))

          expect(bodies(mail)).to all(
            include('You are receiving this mail because you commented in or are watching ' \
                    'these topics')
          )
        end

        it 'explains that watched topics notify a recipient who follows only those' do
          user = create(:user)
          entry = create(:entry)
          create(:entry_comment_notification_override, entry:, user:, level: 'watched_threads')

          mail = mail_for(user, entry:)

          expect(bodies(mail)).to all(
            include('You are receiving this mail because you are watching these topics')
          )
        end

        it 'links the entry to change the notification level' do
          entry = create(:entry)

          mail = mail_for(create(:user), entry:)

          expect(bodies(mail)).to all(include('Change comment notifications'))
          expect(bodies(mail)).to all(include("/admin/entries/#{entry.to_param}"))
        end

        it 'links muting the entry' do
          user = create(:user)
          entry = create(:entry)

          mail = mail_for(user, entry:)

          expect(bodies(mail)).to all(include('Mute this story'))
          expect(bodies(mail)).to all(include('/comment_notifications/mute?token='))
        end

        it 'signs the mute link for the recipient and the entry' do
          user = create(:user)
          entry = create(:entry)

          mail = mail_for(user, entry:)
          token = mail.text_part.body.decoded[/mute\?token=(\S+)/, 1]
          expect(EntryCommentMuteToken.find(CGI.unescape(token))).to eq([user, entry])
        end

        def bodies(mail)
          [mail.html_part.body.decoded, mail.text_part.body.decoded]
        end
      end

      describe 'one-click unsubscribe' do
        it 'points the list unsubscribe header at a mute link for the recipient' do
          user = create(:user)
          entry = create(:entry)

          mail = mail_for(user, entry:)
          token = mail.header['List-Unsubscribe'].value[/mute\?token=(.+)>/, 1]
          expect(EntryCommentMuteToken.find(CGI.unescape(token))).to eq([user, entry])
        end

        it 'lets the client unsubscribe in one click' do
          mail = mail_for(create(:user))

          expect(mail.header['List-Unsubscribe-Post'].value).to eq('List-Unsubscribe=One-Click')
        end
      end

      def mail_for(user, entry: nil, entry_title: 'A Story', author_name: 'Grace Hopper',
                   body: 'A first thought')
        first_name, last_name = author_name.split
        author = create(:user, first_name:, last_name:)
        entry ||= create(:entry, title: entry_title)
        thread = create(:comment_thread, revision: entry.draft)
        create(:comment, comment_thread: thread, creator: author, body:)
        yield thread if block_given?

        UserMailer.comment_digest(digest(user, entry, thread.reload))
      end

      def digest(user, entry, thread, events: nil)
        CommentDigest.new(
          user:,
          entry:,
          threads: [CommentDigest::ThreadGroup.new(
            comment_thread: thread,
            events: events || CommentThreadActivity.events(thread)
          )]
        )
      end
    end
  end
end
