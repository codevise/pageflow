require 'spec_helper'

module Pageflow
  module EntryExportImport
    describe FileMappings do
      it 'allows mapping from exported id to imported id' do
        file_mappings = FileMappings.new
        file_type = BuiltInFileType.image
        exported_id = 10
        imported_id = 20

        file_mappings.find_or_store(exported_id, file_type) do
          build(:image_file, id: imported_id)
        end

        expect(file_mappings.imported_id_for(file_type.type_name, exported_id)).to eq(imported_id)
      end

      it 'allows mapping from imported id to exported id' do
        file_mappings = FileMappings.new
        file_type = BuiltInFileType.image
        exported_id = 10
        imported_id = 20

        file_mappings.find_or_store(exported_id, file_type) do
          build(:image_file, id: imported_id)
        end

        expect(file_mappings.exported_id_for(file_type.type_name, imported_id)).to eq(exported_id)
      end
    end
  end
end
