from playwright.sync_api import Page, expect, sync_playwright
import time

def test_admin_flow(page: Page):
    # Go to BFI-10 start page to get access to Admin link
    page.goto("http://localhost:5173/#/assessment/bfi10")
    time.sleep(2)

    # Click Admin Dashboard Access
    page.click("text=Admin Dashboard Access")
    time.sleep(2)

    # Fill password
    page.fill("input[type='password']", "admin_pass_123")
    page.click("button:has-text('Login')")
    time.sleep(3)

    # Take screenshot of dashboard
    page.screenshot(path="verification/admin_dashboard.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_admin_flow(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/admin_error.png")
        finally:
            browser.close()
