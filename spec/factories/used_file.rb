module Pageflow
  FactoryBot.define do
    factory :used_file, class: UsedFile do
      transient do
        model { nil }
        revision { nil }
      end

      initialize_with do
        file = build(model)
        usage = file.usages.build(revision: revision)

        UsedFile.new(file, usage)
      end
    end
  end
end