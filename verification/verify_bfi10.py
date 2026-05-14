from playwright.sync_api import Page, expect, sync_playwright
import time

def test_bfi10_flow(page: Page):
    # Student takes assessment
    page.goto("http://localhost:5173/#/assessment/bfi10")
    page.wait_for_selector("h1:has-text('BFI-10 Personality Assessment')")

    page.get_by_placeholder("John Doe").fill("Verification Student")
    page.get_by_placeholder("CS12345").fill("STUDENT-001")
    page.get_by_placeholder("john@university.edu").fill("student@example.com")

    page.get_by_role("button", name="Continue to Consent").click()
    page.wait_for_selector("text=Privacy & Consent")
    page.get_by_role("checkbox").check()
    page.get_by_role("button", name="I Agree & Start").click()

    for i in range(10):
        page.wait_for_selector(f"text=Question {i+1}")
        page.get_by_text("Neither agree nor disagree").click()
        time.sleep(0.2)

    page.get_by_role("button", name="Complete Assessment").click()

    # Verify student sees results page
    page.wait_for_selector("text=Your BFI-10 Trait Scores", timeout=10000)
    page.screenshot(path="verification/student_results.png")
    print("Student results verified.")

    # Admin verification
    page.goto("http://localhost:5173/#/bfi10-admin")
    page.wait_for_selector("text=Admin Dashboard")
    page.get_by_placeholder("Enter admin password").fill("MUdaanM")
    page.get_by_role("button", name="Login").click()

    # Verify admin sees the submission
    page.wait_for_selector("text=Verification Student", timeout=10000)
    page.screenshot(path="verification/admin_dashboard_with_data.png")
    print("Admin dashboard verified.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        page.goto("http://localhost:5173")
        page.evaluate("localStorage.setItem('bfi10AdminEntry', 'true')")
        try:
            test_bfi10_flow(page)
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/verification_error.png")
        finally:
            browser.close()
