include Pageflow::Seeds

# Make sure to change the password if you intend to apply this seed to
# a production system.
default_user_password('!Pass123')

account(name: 'Pageflow') do |account|
  entry = sample_entry(account: account, title: 'Example Entry')

  user(account: account,
       role: 'admin',
       email: 'admin@example.com',
       first_name: 'Alice',
       last_name: 'Adminson')

  user(account: account,
       role: 'account_manager',
       email: 'accountmanager@example.com',
       first_name: 'Alfred',
       last_name: 'Mc Count')

  user(account: account,
       email: 'editor@example.com',
       role: 'editor',
       first_name: 'Ed',
       last_name: 'Edison') do |editor|

    membership(user: editor, entry: entry)
  end
end
