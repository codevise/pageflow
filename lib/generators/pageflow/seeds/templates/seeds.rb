include Pageflow::Seeds

# Make sure to change the password if you intend to apply this seed to
# a production system.
default_user_password('!Pass123')

account(name: 'Pageflow') do |account|
  entry = sample_entry(account: account, title: 'Example Entry')

  user(email: 'admin@example.com',
       first_name: 'Alice',
       last_name: 'Adminson',
       admin: true) do |admin|
    membership(user: admin, entity: account, role: 'member')
  end

  user(email: 'accountmanager@example.com',
       first_name: 'Alfred',
       last_name: 'Mc Count') do |account_manager|
    membership(user: account_manager, entity: account, role: 'manager')
  end

  user(email: 'editor@example.com',
       first_name: 'Ed',
       last_name: 'Edison') do |editor|
    membership(user: editor, entity: entry, role: 'editor')
    membership(user: editor, entity: account, role: 'member')
  end
end
