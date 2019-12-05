namespace :pageflow do
  desc 'Generate dummy app for current Rails version.'
  task :dummy do
    require 'pageflow/support'
    Pageflow::Dummy.setup
  end

  namespace :packages do
    desc 'Build JavaScript packages'
    task :build do
      system('yarn install --frozen-lockfile && bin/build-packages ')
    end
  end

  namespace :release do
    task :pageflow_support do
      Dir.chdir('spec/support') do
        puts '=== Releasing pageflow-support ==='
        system('bundle exec rake release')
        puts '==='
      end
    end
  end

  namespace :prune_auto_snapshots_jobs do
    desc 'Enqueue jobs to destroy old auto snapshot revisions'
    task :enqueue => :environment do
      options = {
        created_before: ENV['CREATED_BEFORE'] ? Time.parse(ENV['CREATED_BEFORE']) : 1.month.ago,
        keep_count: ENV.fetch('KEEP_COUNT', 20)
      }

      Pageflow::AutoSnapshotPruning.dirty_entry_ids(options).each do |entry_id|
        Resque.enqueue(Pageflow::PruneAutoSnapshotsJob, entry_id, options)
      end
    end
  end
end
