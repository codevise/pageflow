require 'spec_helper'
require 'rake'

RSpec.describe 'storybook:seed' do
  let(:test_output_dir) do
    Rails.root.join('tmp', 'storybook_task_test').to_s
  end

  before do
    Rake::Task.define_task(:environment)
    Rake.application.rake_require 'tasks/pageflow_scrolled/storybook'

    FileUtils.rm_r(test_output_dir) if File.exist?(test_output_dir)
    FileUtils.mkdir(test_output_dir)

    stub_request(:get, /amazonaws.com/)
      .to_return(status: 200,
                 body: File.read('spec/fixtures/image.jpg'),
                 headers: {'Content-Type' => 'image/jpg'})
  end

  around do |example|
    suppress_output { example.run }
  end

  describe 'setup task' do
    it 'recreates entry' do
      rake 'pageflow_scrolled:storybook:seed:create_entry'
      old_entry_id = Pageflow::Entry.find_by_title('Storybook seed').id
      rake 'pageflow_scrolled:storybook:seed:setup', test_output_dir
      new_entry_id = Pageflow::Entry.find_by_title('Storybook seed').id

      expect(new_entry_id).not_to eq(old_entry_id)
    end
  end

  describe 'create_entry task' do
    it 'creates seed entry' do
      rake 'pageflow_scrolled:storybook:seed:create_entry'

      expect(Pageflow::Entry.where(title: 'Storybook seed'))
        .to exist
    end
  end

  describe 'destroy_entry task' do
    it 'destroys seed entry' do
      rake 'pageflow_scrolled:storybook:seed:create_entry'
      rake 'pageflow_scrolled:storybook:seed:destroy_entry'

      expect(Pageflow::Entry.where(title: 'Storybook seed'))
        .not_to exist
    end
  end

  describe 'generate_json task' do
    it 'writes seed containing files data' do
      rake 'pageflow_scrolled:storybook:seed:create_entry'
      rake 'pageflow_scrolled:storybook:seed:generate_json', test_output_dir

      seed_json = File.read(File.join(test_output_dir, 'seed.json'))

      expect(seed_json).to include('"testReferenceName":"turtle"')
    end

    it 'sets locale to entry locale' do
      rake 'pageflow_scrolled:storybook:seed:create_entry'
      Pageflow::Entry.where(title: 'Storybook seed').first.draft.update(locale: 'fr')
      rake 'pageflow_scrolled:storybook:seed:generate_json', test_output_dir

      seed_json = File.read(File.join(test_output_dir, 'seed.json'))

      expect(seed_json)
        .to include_json(i18n: {
                           locale: 'fr',
                           translations: {
                             fr: {}
                           }
                         })
    end
  end

  describe 'generate_head_html task' do
    it 'writes preview-head.html containing theme custom properties and static template' do
      rake 'pageflow_scrolled:storybook:seed:create_entry'
      rake 'pageflow_scrolled:storybook:seed:generate_head_html', test_output_dir

      html = File.read(File.join(test_output_dir, 'preview-head.html'))

      expect(html).to include('--theme-accent-color:')
      expect(html).to include('[data-percy=hide]')
    end
  end

  def rake(task, *args)
    Rake.application.tasks.each(&:reenable)
    Rake.application[task].invoke(*args)
  end

  def suppress_output
    original_stdout = $stdout.clone
    original_stderr = $stderr.clone
    $stderr.reopen File.new('/dev/null', 'w')
    $stdout.reopen File.new('/dev/null', 'w')
    yield
  ensure
    $stdout.reopen original_stdout
    $stderr.reopen original_stderr
  end
end
