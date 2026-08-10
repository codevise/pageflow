module PageflowScrolled
  FactoryBot.define do
    factory :lottie_file, class: LottieFile do
      entry
      uploader { create(:user) }

      attachment { File.open(Engine.root.join('spec', 'fixtures', 'animation.lottie')) }
      state { 'uploaded' }

      transient do
        used_in { nil }
        with_configuration { nil }
      end

      before(:create) do |file, evaluator|
        file.entry = evaluator.used_in.entry if evaluator.used_in
      end

      after(:create) do |file, evaluator|
        if evaluator.used_in
          create(:file_usage,
                 file:,
                 revision: evaluator.used_in,
                 configuration: evaluator.with_configuration)
        end
      end
    end
  end
end
