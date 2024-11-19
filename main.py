import database

# Create the database if it doesn't exist
database.create_database("users")

# Create
database.create_user('Joe', 25, "users")
database.create_user('Gerald', 30, "users")
database.create_user('Alice', 19, "users")
