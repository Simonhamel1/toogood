import random
import time
import string
import pyautogui
import os

# Disable PyAutoGUI fail-safe completely
pyautogui.FAILSAFE = False
# Set pause to 0 to make it faster
pyautogui.PAUSE = 0

# Static file path - replace with your actual file path
file_path = "ne_pas_supprimer1.py"

# Validate if the file exists
if not os.path.exists(file_path):
    print(f"Error: The file '{file_path}' does not exist.")
    exit(1)

print(f"File '{file_path}' found.")
print("Starting in 5 seconds. Switch to your target window...")
time.sleep(5)

try:
    counter = 0
    start_time = time.time()
    last_click_time = time.time()  # Track when the last click happened
    print("Script started! It will run indefinitely until you stop it with Ctrl+C")
    
    while True:
        try:
            # Generate a random letter (a-z, A-Z)
            random_letter = random.choice(string.ascii_letters)
            
            # Type the letter
            pyautogui.write(random_letter)
            
            # Increment counter
            counter += 1
            
            # Print progress every 100 characters
            if counter % 100 == 0:
                print(f"Characters typed: {counter}")
            
            # Check if 10 minutes (600 seconds) have passed
            if time.time() - start_time >= 600:
                # Press Enter to create a new line
                pyautogui.press('enter')
                start_time = time.time()  # Reset the timer
                print(f"New line created after 10 minutes. Total characters: {counter}")
            
            # Check if 1 hour (3600 seconds) has passed since last click
            if time.time() - last_click_time >= 3600:
                # Perform a mouse click at current position
                pyautogui.click()
                last_click_time = time.time()  # Reset the click timer
                print(f"Mouse click performed after 1 hour. Total characters: {counter}")
            
            # Wait for 1 second
            time.sleep(1)
            
        except pyautogui.FailSafeException:
            print("Fail-safe triggered, but continuing...")
            time.sleep(2)  # Wait a bit and continue
            continue
        except Exception as inner_e:
            print(f"Inner error occurred: {inner_e}, continuing...")
            time.sleep(2)  # Wait a bit and continue
            continue
            
except KeyboardInterrupt:
    print(f"\nScript terminated by user. Total characters typed: {counter}")
except Exception as e:
    print(f"\nOuter error occurred: {e}")
    print("Restarting in 5 seconds...")
    time.sleep(5)
    # Restart the script by executing it again
    os.system(f"python {__file__}")