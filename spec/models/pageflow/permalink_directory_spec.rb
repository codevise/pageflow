require 'spec_helper'

module Pageflow
  describe PermalinkDirectory do
    describe 'path attribute' do
      it 'is valid with only alphanumeric characters, dashes and slahes' do
        permalink_directory = build(:permalink_directory, path: 'en-us/2023/')

        expect(permalink_directory).to be_valid
      end

      it 'must not start with slash' do
        permalink_directory = build(:permalink_directory, path: '/en-us/2023/')

        expect(permalink_directory).to have(1).errors_on(:path)
      end

      it 'may not contain multiple slashes' do
        permalink_directory = build(:permalink_directory, path: 'en-us//2023/')

        expect(permalink_directory).to have(1).errors_on(:path)
      end

      it 'needs to end with slash' do
        permalink_directory = build(:permalink_directory, path: 'en-us/2023')

        expect(permalink_directory).to have(1).errors_on(:path)
      end

      it 'can be empty' do
        permalink_directory = build(:permalink_directory, path: '')

        expect(permalink_directory).to be_valid
      end

      it 'is invalid when anything but alphanumeric characters, dashes and slahes' do
        permalink_directory = build(:permalink_directory, path: '$$$/ test/')

        expect(permalink_directory).to have(1).errors_on(:path)
      end

      it 'needs to be unique in theming' do
        theming = create(:theming)
        create(:permalink_directory, path: 'de/', theming: theming)
        permalink_directory = build(:permalink_directory, path: 'de/', theming: theming)

        expect(permalink_directory).to have(1).errors_on(:path)
      end

      it 'does not need to be unique across themings' do
        create(:permalink_directory, path: 'de/')
        permalink_directory = build(:permalink_directory, path: 'de/')

        expect(permalink_directory).to be_valid
      end
    end
  end
end
