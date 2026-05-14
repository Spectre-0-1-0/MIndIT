from playwright.sync_api import Page, expect, sync_playwright
import time

def test_bfi10_flow(page: Page):
    page.on("request", lambda request: print(f">> {request.method} {request.url}"))
    page.on("response", lambda response: print(f"<< {response.status} {response.url}"))

    page.goto("http://localhost:5173/#/assessment/bfi10")
    page.wait_for_selector("h1:has-text('BFI-10 Personality Assessment')")

    page.get_by_placeholder("John Doe").fill("Jules Verification")
    page.get_by_placeholder("CS12345").fill("VERIFY-001")
    page.get_by_placeholder("john@university.edu").fill("jules@example.com")

    page.get_by_role("button", name="Continue to Consent").click()
    page.wait_for_selector("text=Privacy & Consent")
    page.get_by_role("checkbox").check()
    page.get_by_role("button", name="I Agree & Start").click()

    for i in range(10):
        page.wait_for_selector(f"text=Question {i+1}")
        page.get_by_text("Neither agree nor disagree").click()
        time.sleep(0.5)

    submit_btn = page.get_by_role("button", name="Complete Assessment")
    submit_btn.click()

    page.wait_for_selector("text=Assessment Submitted Successfully", timeout=10000)
    page.screenshot(path="verification/bfi10_success.png")

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
