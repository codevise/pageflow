json.partial!(collection: @files,
              partial: 'pageflow/editor/files/file',
              locals: {file_type:},
              as: :file)
