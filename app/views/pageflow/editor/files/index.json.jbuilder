json.array!(@files, :partial => "pageflow/editor/#{@collection_name}/#{@model_name.to_s}", :as => @model_name)
