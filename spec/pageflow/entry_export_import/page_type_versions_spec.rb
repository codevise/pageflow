require 'spec_helper'

module Pageflow
  module EntryExportImport
    describe PageTypeVersions do
      it 'does not raise error if dumped versions match page type versions' do
        Pageflow.config.page_types.register(TestPageType.new(name: 'test',
                                                             export_version: '2.1.0'))
        data = PageTypeVersions.dump

        expect {
          PageTypeVersions.verify_compatibility!(data)
        }.not_to raise_error
      end

      it 'raise error if dumped versions do not match page type versions' do
        Pageflow.config.page_types.register(TestPageType.new(name: 'test',
                                                             export_version: '2.1.0',
                                                             import_version_requirement: '2.1.1'))

        data = PageTypeVersions.dump

        expect {
          PageTypeVersions.verify_compatibility!(data)
        }.to raise_error PageTypeVersions::IncompatibleVersionsError
      end
    end
  end
end
