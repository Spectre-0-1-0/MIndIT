import os

memories = [
    "BFI-10 standard questions: Is reserved(E-R), Is generally trusting(A), Tends to be lazy(C-R), Is relaxed(N-R), Has few artistic interests(O-R), Is outgoing(E), Tends to find fault with others(A-R), Does a thorough job(C), Gets nervous easily(N), Has an active imagination(O).",
    "BFI-10 scoring: Average of two items per trait. Reverse score indices 0, 2, 3, 4, 6 (1-based items 1, 3, 4, 5, 7) for a 1-5 scale.",
    "SQLite backend for MindCheck: Uses express, sqlite3, and jwt for admin auth. Database schema includes bfi10_submissions and admin_users.",
    "Frontend architecture: React with React Router, Tailwind CSS, and Vite. Assessments are self-guided and results are passed via state to ResultsPage."
]

for memory in memories:
    print(f"Memory recorded: {memory}")
