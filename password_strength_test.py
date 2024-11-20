from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

# Set up the WebDriver (adjust the path to where chromedriver is located)
driver = webdriver.Chrome(executable_path='/path/to/chromedriver')

# Open the target URL
driver.get("https://lowe.github.io/tryzxcvbn/")

# Find the password input field
password_input = driver.find_element(By.ID, "password")

# A list of test passwords to try
test_passwords = [
    "12345",  # Very weak
    "password",  # Weak
    "qwerty",  # Weak
    "abc123",  # Weak
    "strongPassword123!",  # Strong
    "complexP@ssw0rd!2024"  # Strong
]

# Iterate through the test passwords
for pwd in test_passwords:
    # Clear any existing input
    password_input.clear()
    
    # Type the password into the input field
    password_input.send_keys(pwd)
    
    # Wait for the feedback to update
    time.sleep(2)
    
    # Find the feedback element
    feedback = driver.find_element(By.ID, "feedback")
    
    # Print the feedback and the current password
    print(f"Testing password: '{pwd}'")
    print("Feedback:", feedback.text)
    print("-" * 50)

# Close the browser after the test
driver.quit()
