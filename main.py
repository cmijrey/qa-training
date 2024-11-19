import database

# Create the database if it doesn't exist
database.create_database("users")

# Create
database.create_user('Joe', 25, "users")
database.create_user('Gerald', 30, "users")
database.create_user('Alice', 19, "users")

# READ
database.get_user('Alice')
#database.print_database()

#UPDATE
database.update_user('Joe', 40)
database.get_user('Joe')

#DELETE
database.delete_user('Alice')
database.print_database()