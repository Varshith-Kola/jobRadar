from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pandas as pd
import time

def scrape_jobs(config):
    # Setup Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Ensure GUI is off
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    # Set path to chromedriver as per your configuration
    webdriver_service = Service("/opt/homebrew/bin/chromedriver")  # Adjust path as needed

    # Choose Chrome Browser
    driver = webdriver.Chrome(service=webdriver_service, options=chrome_options)

    # Open the webpage
    driver.get(config["url"])

    job_listings = []

    while True:
        # Wait for the job listings to load
        wait = WebDriverWait(driver, 20)  # Increased timeout to 20 seconds
        try:
            wait.until(EC.presence_of_element_located((By.CLASS_NAME, config["list_items_class"])))
            # print("Page loaded successfully.")
        except Exception as e:
            print(f"Error waiting for the page to load: {e}")
            break

        # Find all job listing elements
        job_divs = driver.find_elements(By.CLASS_NAME, config["list_items_class"])
        # print(f"Found {len(job_divs)} job divs")  # Debugging output

        for job_div in job_divs:
            # Find all <a> tags inside each job listing element
            a_tags = job_div.find_elements(By.TAG_NAME, 'a')
            
            for a_tag in a_tags:
                try:
                    link = config["base_url"] + a_tag.get_attribute('href')

                    # Get job title
                    title_span = a_tag.find_element(By.CLASS_NAME, config["title_class"])
                    title = title_span.text.strip() if title_span else "No title available"

                    # Get job location
                    location_span = a_tag.find_element(By.XPATH, config["location_xpath"])
                    location = location_span.text.strip() if location_span else "No location available"

                    job_listings.append({
                        'Title': title,
                        'Link': link,
                        'Company': config["company_name"],  # Static value since all jobs are from the same company
                        'Location': location,
                        'Date Posted': 'N/A'  # Placeholder value since date posted is not provided
                    })
                except Exception as e:
                    print(f"Error processing job element: {e}")

        # Check if there is a "Next Page" button and click it
        try:
            next_button = driver.find_element(By.XPATH, config["next_button_xpath"])
            if "aria-disabled" in next_button.get_attribute("outerHTML") and next_button.get_attribute("aria-disabled") == "true":
                print("No more pages to load.")
                break
            driver.execute_script("arguments[0].click();", next_button)
            time.sleep(5)  # Wait for the next page to load
        except Exception as e:
            # print(f"Error finding or clicking the next button: {e}")
            break

    # Convert to DataFrame
    df = pd.DataFrame(job_listings)
    print(df)

    if not job_listings:
        print("No job listings found")  # Debugging output
    else:
        df.to_csv(config["output_csv"], index=False)
        print(f"Job listings saved to {config['output_csv']}")

    driver.quit()

if __name__ == "__main__":
    config = {
        "url": "https://careers.tiktok.com/position?keywords=&location=&limit=1000",
        "base_url": "https://careers.tiktok.com",
        "list_items_class": "listItems__1q9i5",
        "title_class": "content__3ZUKJ",
        "location_xpath": ".//div[contains(@class, 'subTitle__3sRa3')]//span",
        "next_button_xpath": "//li[contains(@class, 'atsx-pagination-next') and not(contains(@class, 'atsx-pagination-disabled'))]",
        "company_name": "TikTok",
        "output_csv": "tiktok_jobs.csv"
    }
    scrape_jobs(config)
