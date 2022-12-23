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
      permalink_directory = create(:permalink_directory, site: site)
      create(
        :entry,
        site: site,
        permalink_attributes: {
          slug: 'slug',
          directory: permalink_directory
        }
      )
      entry = build(
        :entry,
        site: site,
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
        site: site,
        permalink_attributes: {
          slug: 'slug',
          directory_path: 'en/'
        }
      )
      entry = build(
        :entry,
        site: site,
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

    it 'does not enforce uniqueness when generating default slug' do
      account = create(:account)
      permalink_directory = create(
        :permalink_directory,
        site: account.default_site
      )
      create(
        :entry,
        account: account,
        permalink_attributes: {
          slug: 'my-example',
          directory: permalink_directory
        }
      )
      entry = build(
        :entry,
        account: account,
        title: 'My Example',
        permalink_attributes: {
          slug: '',
          directory: permalink_directory
        }
      )

      expect(entry).to have(1).error_on('permalink.slug')
    end
  end
end
