from playwright.sync_api import Page, expect, sync_playwright
import time

def test_bfi10_flow(page: Page):
    # Navigate to BFI-10
    page.goto("http://localhost:5173/#/assessment/bfi10")
    time.sleep(3)

    # Fill user data
    page.fill("input[placeholder='John Doe']", "Verification User")
    page.fill("input[placeholder='CS12345']", "VER123")
    page.fill("input[type='email']", "verify@example.com")
    page.click("text=Continue to Consent")
    time.sleep(1)

    # Click the checkbox to enable the button
    page.get_by_role("checkbox").check()
    time.sleep(0.5)

    # Consent and Start
    page.click("text=I Agree & Start")
    time.sleep(1)

    # Answer questions
    for i in range(10):
        # Click "Agree a little" for all questions
        page.get_by_role("button", name="Agree a little", exact=True).click()
        time.sleep(0.5)

    # Complete
    page.get_by_text("Complete Assessment").click()
    time.sleep(5)
    page.screenshot(path="verification/results.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_bfi10_flow(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
