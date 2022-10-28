require 'spec_helper'

module Pageflow
  describe Permalinkable do
    it 'accepts permalink attributes on create' do
      entry = create(:entry, permalink_attributes: {slug: 'some-slug'})

      expect(entry.permalink).to have_attributes(slug: 'some-slug')
    end

    it 'accepts permalink attributes on update' do
      entry = create(:entry, permalink_attributes: {slug: 'old-slug'})

      entry.update(permalink_attributes: {slug: 'new-slug'})

      expect(entry.permalink.reload).to have_attributes(slug: 'new-slug')
    end

    it 'is invalid if permalink directory belongs to different theming' do
      other_theming = create(:theming)
      permalink_directory = create(:permalink_directory, theming: other_theming)
      entry = build(
        :entry,
        permalink_attributes: {
          slug: 'slug'
        }
      )

      entry.permalink.directory = permalink_directory

      expect(entry).to have(1).errors_on('permalink.directory')
    end

    it 'is invalid if slug is already taken in permalink directory of theming' do
      theming = create(:theming)
      permalink_directory = create(:permalink_directory, theming: theming)
      create(
        :entry,
        theming: theming,
        permalink_attributes: {
          slug: 'slug',
          directory: permalink_directory
        }
      )
      entry = build(
        :entry,
        theming: theming,
        permalink_attributes: {
          slug: 'slug',
          directory: permalink_directory
        }
      )

      expect(entry).to have(1).errors_on('permalink.slug')
    end

    it 'is valid if slug has been used in different permalink directory' do
      theming = create(:theming)
      create(
        :entry,
        theming: theming,
        permalink_attributes: {
          slug: 'slug',
          directory_path: 'en/'
        }
      )
      entry = build(
        :entry,
        theming: theming,
        permalink_attributes: {
          slug: 'slug',
          directory_path: 'de/'
        }
      )

      expect(entry).to be_valid
    end

    it 'is valid if slug has been used in different theming' do
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

    it 'is invalid if slug is empty' do
      entry = build(
        :entry,
        permalink_attributes: {
          slug: ''
        }
      )

      expect(entry).to have(1).error_on('permalink.slug')
    end
  end
end
