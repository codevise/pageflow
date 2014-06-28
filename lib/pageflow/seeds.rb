# Require this file in db/seeds.rb to create example records for development mode.

module Pageflow
  # Default Account

  if Account.any?
    default_account = Account.first
    puts "   Account exists."
  else
    default_account = Account.create!(:name => 'Pageflow') do |account|
      account.build_default_theming do |theming|
        theming.theme_name = Pageflow.config.themes.names.first

        theming.imprint_link_label = 'Impressum'
        theming.imprint_link_url = 'http://example.com/impressum.html'
        theming.copyright_link_label = '&copy; Pageflow 2014'
        theming.copyright_link_url = 'http://www.example.com/copyright.html'
      end
    end

    puts "   Created default account."
  end

  # Users

  def self.create_user(options)
    options[:password_confirmation] = options[:password]
    Account.first.users.create!(options)

    puts <<-END
   Created #{options[:admin] ? 'admin' : 'editor'} user:

     email:     #{options[:email]}
     password:  #{options[:password]}

  END
  end

  if default_account.users.none?
    create_user(:email => 'admin@example.com',
                :password => '!Pass123',
                :first_name => 'Alice',
                :last_name => 'Adminson',
                :role => 'admin')

    create_user(:email => 'accountmanager@example.com',
                :password => '!Pass123',
                :first_name => 'Alfred',
                :last_name => 'Mc Count',
                :role => 'account_manager')

    create_user(:email => 'editor@example.com',
                :password => '!Pass123',
                :first_name => 'Ed',
                :last_name => 'Edison')
  else
    puts "   Users exist."
  end

  # Sample entry

  unless Entry.any?
    entry = default_account.entries.create!(:title => 'Fiese Flut', :theming_id => default_account.default_theming.id)

    chapter = entry.draft.chapters.create!(:title => 'Kapitel 1')
    chapter.pages.create!(:template => 'background_image')
    chapter.pages.create!(:template => 'background_image')

    chapter = entry.draft.chapters.create!(:title => 'Kapitel 2')
    chapter.pages.create!(:template => 'video')

    puts "   Created sample entry."
  end

  # Sample membership

  unless Membership.any?
    membership = Membership.create!(:user => default_account.users.editors.first,
      :entry => Entry.first)
    puts "   Created sample membership."
  end

  # Sample revision

  unless Revision.any?
    revision = Revision.create!(:creator => default_account.users.editors.first,
      :entry => Entry.first)
    puts "   Created sample revision."
  end
end
