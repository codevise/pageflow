require 'spec_helper'

module Pageflow
  describe EntryDuplicate do
    describe '#create!' do
      it 'creates an entry with a title containing the original title' do
        entry = create(:entry, title: 'Some Title')

        duplicate = EntryDuplicate.of(entry).create!

        expect(duplicate).to be_persisted
        expect(duplicate.title).to include('Some Title')
      end

      it 'creates entry with same type, account and site' do
        entry = create(:entry)

        duplicate = EntryDuplicate.of(entry).create!

        expect(duplicate.type_name).to eq(entry.type_name)
        expect(duplicate.account).to eq(entry.account)
        expect(duplicate.site).to eq(entry.site)
      end

      it 'copies draft' do
        entry = create(:entry, title: 'Some Title')
        create(:chapter,
               in_main_storyline_of: entry.draft,
               title: 'Original Chapter')

        duplicate = EntryDuplicate.of(entry).create!
        chapter_titles = duplicate.draft.chapters.map(&:title)

        expect(chapter_titles).to eq(['Original Chapter'])
      end

      it 'copies memberships' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        duplicate = EntryDuplicate.of(entry).create!

        expect(duplicate.users.first).to eq(user)
      end

      it 'only copies memberships of users with membership on target account' do
        other_account = create(:account)
        user_on_both_accounts = create(:user, :member, on: other_account)
        user_on_original_account = create(:user)
        entry = create(:entry,
                       with_previewer: user_on_both_accounts,
                       with_editor: user_on_original_account)

        duplicate = EntryDuplicate.of(entry, attributes: {account_id: other_account.id}).create!

        expect(duplicate.users).to eq([user_on_both_accounts])
      end

      it 'does not copy memberships if copy_memberships is false' do
        entry = create(:entry, with_previewer: create(:user))

        duplicate = EntryDuplicate.of(entry, copy_memberships: false).create!

        expect(duplicate.users).to be_empty
      end

      it 'uses passed title' do
        entry = create(:entry, title: 'Some Title')

        duplicate = EntryDuplicate.of(entry, attributes: {title: 'Other Title'}).create!

        expect(duplicate.title).to eq('Other Title')
      end

      it 'copies folder' do
        account = create(:account)
        folder = create(:folder, account:)
        entry = create(:entry, account:, folder:)

        duplicate = EntryDuplicate.of(entry).create!

        expect(duplicate.folder).to eq(folder)
      end

      it 'supports placing duplicate in other account' do
        account = create(:account)
        entry = create(:entry, account:, folder: create(:folder, account:))
        other_account = create(:account)

        duplicate = EntryDuplicate.of(entry, attributes: {account_id: other_account.id}).create!

        expect(duplicate).to have_attributes(account: other_account,
                                             site: other_account.default_site,
                                             folder: nil)
      end

      it 'supports placing duplicate in other site of same account' do
        entry = create(:entry)
        other_site = create(:site, account: entry.account)

        duplicate = EntryDuplicate.of(entry, attributes: {site_id: other_site.id}).create!

        expect(duplicate.site).to eq(other_site)
      end

      it 'raises if attributes are invalid' do
        entry = create(:entry)

        expect {
          EntryDuplicate.of(entry, attributes: {title: ''}).create!
        }.to raise_error(ActiveRecord::RecordInvalid)
      end

      it 'copies enabled features' do
        entry = create(:entry, features_configuration: {fancy_page_type: true})

        duplicate = EntryDuplicate.of(entry).create!

        expect(duplicate.feature_state('fancy_page_type')).to eq(true)
      end

      it 'copies perma id counter' do
        entry = create(:entry, perma_id_counter: 20)

        duplicate = EntryDuplicate.of(entry).create!

        expect(duplicate.perma_id_counter).to eq(entry.perma_id_counter)
      end

      it 'creates a permalink in same directory if original has one' do
        entry = create(
          :entry,
          title: 'My entry',
          permalink_attributes: {
            slug: 'slug',
            directory_path: 'en/'
          }
        )

        duplicate = EntryDuplicate.of(entry).create!

        expect(duplicate.permalink)
          .to have_attributes(slug: 'copy-of-my-entry',
                              directory: entry.permalink.directory)
      end

      it 'makes permalink slugs unique in directory' do
        account = create(:account)
        permalink_directory = create(
          :permalink_directory,
          site: account.default_site
        )
        create(
          :entry,
          account:,
          permalink_attributes: {
            slug: 'copy-of-my-entry',
            directory: permalink_directory
          }
        )
        entry = create(
          :entry,
          account:,
          title: 'My entry',
          permalink_attributes: {
            slug: 'slug',
            directory: permalink_directory
          }
        )

        duplicate = EntryDuplicate.of(entry).create!

        expect(duplicate.permalink)
          .to have_attributes(slug: 'copy-of-my-entry-2',
                              directory: permalink_directory)
      end

      it 'makes default slug unique when entry is duplicated repeatedly' do
        entry = create(:entry,
                       title: 'My entry',
                       permalink_attributes: {slug: 'slug', directory_path: 'en/'})

        EntryDuplicate.of(entry).create!
        EntryDuplicate.of(entry).create!
        duplicate = EntryDuplicate.of(entry).create!

        expect(duplicate.permalink).to have_attributes(slug: 'copy-of-my-entry-3')
      end

      it 'makes default slug for blank passed slug unique in directory' do
        entry = create(:entry,
                       title: 'My entry',
                       permalink_attributes: {slug: 'slug', directory_path: 'en/'})
        EntryDuplicate.of(entry).create!

        duplicate = EntryDuplicate.of(
          entry,
          attributes: {
            permalink_attributes: {slug: '', directory_id: entry.permalink.directory_id}
          }
        ).create!

        expect(duplicate.permalink).to have_attributes(slug: 'copy-of-my-entry-2')
      end

      it 'does not create permalink in directory of original site if placed in other account' do
        entry = create(:entry, permalink_attributes: {slug: 'slug', directory_path: 'en/'})
        other_account = create(:account)

        duplicate = EntryDuplicate.of(entry, attributes: {account_id: other_account.id}).create!

        expect(duplicate.permalink).to be_nil
      end

      it 'does not create permalink in directory of original site if placed in other site' do
        entry = create(:entry, permalink_attributes: {slug: 'slug', directory_path: 'en/'})
        other_site = create(:site, account: entry.account)

        duplicate = EntryDuplicate.of(entry, attributes: {site_id: other_site.id}).create!

        expect(duplicate.permalink).to be_nil
      end

      it 'uses passed permalink attributes' do
        entry = create(:entry, permalink_attributes: {slug: 'slug', directory_path: 'en/'})
        other_directory = create(:permalink_directory, site: entry.site, path: 'de/')

        duplicate = EntryDuplicate.of(
          entry,
          attributes: {permalink_attributes: {slug: 'custom', directory_id: other_directory.id}}
        ).create!

        expect(duplicate.permalink)
          .to have_attributes(slug: 'custom', directory: other_directory)
      end

      it 'uses default slug based on passed title if passed slug is blank' do
        entry = create(:entry, permalink_attributes: {slug: 'slug', directory_path: 'en/'})

        duplicate = EntryDuplicate.of(
          entry,
          attributes: {
            title: 'Other Title',
            permalink_attributes: {slug: '', directory_id: entry.permalink.directory_id}
          }
        ).create!

        expect(duplicate.permalink).to have_attributes(slug: 'other-title')
      end

      it 'only keeps permalink unique in directory' do
        create(
          :entry,
          permalink_attributes: {
            slug: 'copy-of-my-entry'
          }
        )
        entry = create(
          :entry,
          title: 'My entry',
          permalink_attributes: {
            slug: 'slug',
            directory_path: 'en/'
          }
        )

        duplicate = EntryDuplicate.of(entry).create!

        expect(duplicate.permalink)
          .to have_attributes(slug: 'copy-of-my-entry',
                              directory: entry.permalink.directory)
      end
    end

    describe '#save' do
      it 'returns false and does not create entry if attributes are invalid' do
        entry = create(:entry)
        duplicate = EntryDuplicate.of(entry, attributes: {title: ''})

        expect {
          expect(duplicate.save).to eq(false)
        }.not_to(change { Entry.count })
        expect(duplicate.new_entry.errors).to include(:title)
      end

      it 'keeps passed slug if permalink slug is taken' do
        entry = create(:entry, permalink_attributes: {slug: 'taken', directory_path: 'en/'})
        duplicate = EntryDuplicate.of(
          entry,
          attributes: {
            permalink_attributes: {slug: 'taken', directory_id: entry.permalink.directory_id}
          }
        )

        duplicate.save

        expect(duplicate.new_entry.permalink.slug).to eq('taken')
      end

      it 'keeps blank passed slug if save fails' do
        entry = create(:entry, permalink_attributes: {slug: 'slug', directory_path: 'en/'})
        directory_of_other_site = create(:permalink_directory)
        duplicate = EntryDuplicate.of(
          entry,
          attributes: {
            permalink_attributes: {slug: '', directory_id: directory_of_other_site.id}
          }
        )

        duplicate.save

        expect(duplicate.new_entry.permalink.slug).to eq('')
      end

      it 'does not create entry if permalink slug is taken' do
        entry = create(:entry, permalink_attributes: {slug: 'taken', directory_path: 'en/'})
        duplicate = EntryDuplicate.of(
          entry,
          attributes: {
            permalink_attributes: {slug: 'taken', directory_id: entry.permalink.directory_id}
          }
        )

        expect {
          expect(duplicate.save).to eq(false)
        }.not_to(change { Entry.count })
      end
    end
  end
end
