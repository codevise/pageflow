module Pageflow
  # @api private
  #
  # ActiveAdmin passes class objects to CanCan when authorizing access
  # to the "index" and "new resource" pages. CanCan does not evaluate
  # `can` blocks when classes are passed as subjects. Since the above
  # code relies on block evaluation for all but the `admin` case, this
  # causes "new" buttons and menu items to be displayed even though
  # access should not be permitted.
  #
  # see also https://github.com/activeadmin/activeadmin/issues/5144
  #
  # Detect these cases and pass the collection name as subject
  # instead. To prevent collision with existing cases, rename actions:
  #
  #     :read, User  ->  :index, :users
  #     :create, User  ->  :create_any, :users
  module ActiveAdminCanCanFix
    def can?(action, subject)
      if [:read, :new, :create].include?(action) &&
         [Entry, Account, User].include?(subject)
        collection_name = subject.name.demodulize.underscore.pluralize.to_sym

        if action == :read
          super(:index, collection_name)
        else
          super(:create_any, collection_name)
        end
      else
        super
      end
    end
  end
end
