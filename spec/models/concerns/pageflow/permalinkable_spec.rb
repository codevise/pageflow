require 'spec_helper'

module Pageflow
  describe Permalinkable do
    it 'accepts permalink attributes on create' do
      entry = build(:entry)
      permalink_directory = create(:permalink_directory, site: entry.site)
      entry.update!(permalink_attributes: {
                      slug: 'some-slug',
                      directory: permalink_directory
                    })

      expect(entry.permalink).to have_attributes(slug: 'some-slug')
    end

    it 'accepts permalink attributes on update' do
      entry = create(:entry, permalink_attributes: {slug: 'old-slug'})

      entry.update(permalink_attributes: {slug: 'new-slug'})

      expect(entry.permalink.reload).to have_attributes(slug: 'new-slug')
    end

    it 'is invalid if permalink directory belongs to different site' do
      other_site = create(:site)
      permalink_directory = create(:permalink_directory, site: other_site)
      entry = build(
        :entry,
        permalink_attributes: {
          slug: 'slug'
        }
      )

      entry.permalink.directory = permalink_directory

      expect(entry).to have(1).errors_on('permalink.directory')
    end

    it 'is invalid if slug is already taken in permalink directory of site' do
      site = create(:site)
      permalink_directory = create(:permalink_directory, site:)
      create(
        :entry,
        site:,
        permalink_attributes: {
          slug: 'slug',
          directory: permalink_directory
        }
      )
      entry = build(
        :entry,
        site:,
        permalink_attributes: {
          slug: 'slug',
          directory: permalink_directory
        }
      )

      expect(entry).to have(1).errors_on('permalink.slug')
    end

    it 'is valid if slug has been used in different permalink directory' do
      site = create(:site)
      create(
        :entry,
        site:,
        permalink_attributes: {
          slug: 'slug',
          directory_path: 'en/'
        }
      )
      entry = build(
        :entry,
        site:,
        permalink_attributes: {
          slug: 'slug',
          directory_path: 'de/'
        }
      )

      expect(entry).to be_valid
    end

    it 'is valid if slug has been used in different site' do
      create(
        :entry,
        permalink_attributes: {
          slug: 'slug'
        }
      )
      entry = build(
        :entry,
        permalink_attributes: {
          slug: 'slug'
        }
      )

      expect(entry).to be_valid
    end

    it 'is valid if slug consists of alpha numerics, dashes and underscores' do
      entry = build(
        :entry,
        permalink_attributes: {
          slug: 'this-is-ALLOWED_1234'
        }
      )

      expect(entry).to be_valid
    end

    it 'is invalid if slug contains illegal characters' do
      entry = build(
        :entry,
        permalink_attributes: {
          slug: '$%&'
        }
      )

      expect(entry).to have(1).error_on('permalink.slug')
    end

    it 'uses default slug based on entry title if empty string' do
      entry = create(
        :entry,
        title: 'My Example',
        permalink_attributes: {
          slug: ''
        }
      )

      expect(entry.permalink).to have_attributes(slug: 'my-example')
    end

    it 'has flag attribute to allow root path' do
      entry = create(
        :entry,
        title: 'My Example',
        permalink_attributes: {
          allow_root_path: true,
          slug: ''
        }
      )

      expect(entry.permalink).to have_attributes(slug: '')
    end

    it 'ignores root path flag in directory' do
      entry = create(
        :entry,
        title: 'My Example',
        permalink_attributes: {
          allow_root_path: true,
          directory_path: 'en/',
          slug: ''
        }
      )

      expect(entry.permalink).to have_attributes(slug: 'my-example')
    end

    it 'sets default slug on update' do
      entry = create(
        :entry,
        title: 'My Example',
        permalink_attributes: {
          slug: 'some-slug'
        }
      )

      entry.update(permalink_attributes: {slug: ''})

      expect(entry.permalink).to have_attributes(slug: 'my-example')
    end

    it 'does not enforce uniqueness when generating default slug' do
      account = create(:account)
      permalink_directory = create(
        :permalink_directory,
        site: account.default_site
      )
      create(
        :entry,
        account:,
        permalink_attributes: {
          slug: 'my-example',
          directory: permalink_directory
        }
      )
      entry = build(
        :entry,
        account:,
        title: 'My Example',
        permalink_attributes: {
          slug: '',
          directory: permalink_directory
        }
      )

      expect(entry).to have(1).error_on('permalink.slug')
    end

    it 'creates permalink redirect when slug changes' do
      entry = create(
        :entry,
        :published,
        permalink_attributes: {
          slug: 'old-slug'
        }
      )

      entry.update(
        permalink_attributes: {
          slug: 'new-slug'
        }
      )

      expect(entry.permalink_redirects)
        .to include(an_object_having_attributes(slug: 'old-slug',
                                                directory: entry.permalink.directory))
    end

    it 'creates permalink redirect when directory changes' do
      site = create(:site)
      old_directory = create(:permalink_directory, site:, path: 'de/')
      new_directory = create(:permalink_directory, site:, path: 'en/')
      entry = create(
        :entry,
        :published,
        site:,
        permalink_attributes: {
          slug: 'some-slug',
          directory: old_directory
        }
      )

      entry.update(
        permalink_attributes: {
          directory: new_directory
        }
      )

      expect(entry.permalink_redirects)
        .to include(an_object_having_attributes(slug: 'some-slug',
                                                directory: old_directory))
    end

    it 'does not create permalink redirect when directory and slug are unchanged' do
      entry = create(
        :entry,
        :published,
        permalink_attributes: {
          slug: 'some-slug'
        }
      )

      entry.update(
        permalink_attributes: {
          updated_at: 1.day.ago
        }
      )

      expect(entry.permalink_redirects).to be_empty
    end

    it 'does not create permalink redirect for unpublished entries' do
      site = create(:site)
      old_directory = create(:permalink_directory, site:, path: 'de/')
      new_directory = create(:permalink_directory, site:, path: 'en/')
      entry = create(
        :entry,
        site:,
        permalink_attributes: {
          slug: 'some-slug',
          directory: old_directory
        }
      )

      entry.update(
        permalink_attributes: {
          slug: 'new-slug',
          directory: new_directory
        }
      )

      expect(entry.permalink_redirects).to be_empty
    end

    it 'removes old redirect when new is created' do
      directory = create(:permalink_directory)
      entry = create(
        :entry,
        :published,
        site: directory.site,
        permalink_attributes: {
          directory:,
          slug: 'old-slug'
        }
      )
      other_entry = create(
        :entry,
        :published,
        site: directory.site,
        permalink_attributes: {
          directory:,
          slug: 'other-slug'
        }
      )

      entry.update(
        permalink_attributes: {
          slug: 'new-slug'
        }
      )
      other_entry.update(
        permalink_attributes: {
          slug: 'old-slug'
        }
      )
      other_entry.update(
        permalink_attributes: {
          slug: 'other-new-slug'
        }
      )

      expect(entry.permalink_redirects.reload).to be_empty
    end

    it 'destroys permalink when entry is destroyed' do
      entry = create(
        :entry,
        permalink_attributes: {
          slug: 'some-slug'
        }
      )

      expect {
        entry.destroy
      }.to change(Permalink, :count).by(-1)
    end

    it 'destroys permalink redirects when entry is destroyed' do
      entry = create(
        :entry,
        :published,
        permalink_attributes: {
          slug: 'old-slug'
        }
      )

      entry.update(
        permalink_attributes: {
          slug: 'new-slug'
        }
      )

      expect {
        entry.destroy
      }.to change(PermalinkRedirect, :count).by(-1)
    end
  end
end
