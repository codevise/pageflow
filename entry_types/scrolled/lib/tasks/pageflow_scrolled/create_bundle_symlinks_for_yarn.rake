namespace :pageflow_scrolled do
  desc <<-DESC
    Make Yarn use packages embedded in gems.

    For each package.json dependency of the form

       .bundle/for-yarn/gem-name/package/path

    create a symlink in the Git ignored directory .bundle/for-yarn which
    points to the location of the gem as reported by `bundle show`.

    This script is executed as preinstall script when running `yarn
    install`.
  DESC
  task :create_bundle_symlinks_for_yarn do
    referenced_gems =
      File.read('package.json').scan(%r{.bundle/for-yarn/([a-z_-]+)}).flatten.uniq

    FileUtils.rm_rf '.bundle/for-yarn'
    FileUtils.mkdir_p '.bundle/for-yarn'

    puts 'Creating symlinks for .bundle entries in package.json:'

    referenced_gems.each do |gem|
      symlink = ".bundle/for-yarn/#{gem}"
      gem_location = `bundle show #{gem}`.strip

      puts "#{symlink} -> #{gem_location}"
      FileUtils.ln_s gem_location, symlink
    end
  end
end
