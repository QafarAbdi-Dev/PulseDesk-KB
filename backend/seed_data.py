from database import SessionLocal
from models import Category, Article, User
from security import hash_password

db = SessionLocal()

# Create or find the admin user
admin = db.query(User).filter(User.email == "admin@pulsedesk.test").first()
if not admin:
    admin = User(
        name="Admin",
        email="admin@pulsedesk.test",
        password_hash=hash_password("admin12345"),
        role="admin",
        department="IT",
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)

ADMIN_ID = admin.id

categories_data = [
    {"name": "Getting Started", "slug": "getting-started", "description": "Onboarding and first-login guidance"},
    {"name": "Patient Management", "slug": "patient-management", "description": "Registration, admission, discharge"},
    {"name": "Clinical Modules", "slug": "clinical-modules", "description": "Lab, pharmacy, radiology workflows"},
    {"name": "Billing & Finance", "slug": "billing-finance", "description": "Claims, insurance, payment processing"},
    {"name": "System Administration", "slug": "system-administration", "description": "User management, roles, backups"},
    {"name": "Compliance & Security", "slug": "compliance-security", "description": "Data privacy, audit logs"},
    {"name": "Troubleshooting", "slug": "troubleshooting", "description": "Common errors and fixes"},
    {"name": "Release Notes", "slug": "release-notes", "description": "Version history and updates"},
]

category_objects = {}
for cat in categories_data:
    existing = db.query(Category).filter(Category.slug == cat["slug"]).first()
    if existing:
        category_objects[cat["slug"]] = existing
    else:
        new_cat = Category(**cat)
        db.add(new_cat)
        db.commit()
        db.refresh(new_cat)
        category_objects[cat["slug"]] = new_cat

articles_data = [
    ("System Overview and First Login", "system-overview-first-login", "PulseDesk-KB is the internal knowledge base for HMIS support. Log in using credentials from your IT administrator. Complete your profile before your first shift.", "getting-started"),
    ("Navigating the Dashboard", "navigating-the-dashboard", "The dashboard shows recent articles, your assigned categories, and quick search. Use the sidebar to browse by topic.", "getting-started"),
    ("Setting Up Your User Profile", "setting-up-user-profile", "Go to your profile settings to update your name, department, and contact details after first login.", "getting-started"),
    ("Resetting Your Password", "resetting-your-password", "Click Forgot Password on the login screen, check your email for a reset link, then set a new password.", "getting-started"),
    ("Understanding User Roles", "understanding-user-roles", "Viewers can read content. Editors can submit drafts. Admins can publish, manage users, and review analytics.", "getting-started"),
    ("Registering a New Patient", "registering-new-patient", "Enter the patient's demographic details, verify identity documents, and assign a unique patient ID before saving.", "patient-management"),
    ("Patient Admission Process", "patient-admission-process", "Confirm the patient's registration record, assign a ward and bed, and record the admitting clinician.", "patient-management"),
    ("Discharge Procedure Checklist", "discharge-procedure-checklist", "Complete the discharge summary, confirm billing is settled, and provide discharge instructions before releasing the patient.", "patient-management"),
    ("Searching for a Patient Record", "searching-patient-record", "Use the patient search bar with name, ID, or date of birth to locate existing records quickly.", "patient-management"),
    ("Lab Order Entry Guide", "lab-order-entry-guide", "Select the patient, choose the required lab tests, and submit the order for processing by the lab team.", "clinical-modules"),
    ("Pharmacy Dispensing SOP", "pharmacy-dispensing-sop", "Verify the prescription, check for drug interactions, and record the dispensed medication against the patient's chart.", "clinical-modules"),
    ("Radiology Request Workflow", "radiology-request-workflow", "Submit imaging requests with clinical justification. Radiology staff will schedule and update the record once complete.", "clinical-modules"),
    ("Outpatient Visit Documentation", "outpatient-visit-documentation", "Record visit notes, diagnosis codes, and follow-up instructions for each outpatient encounter.", "clinical-modules"),
    ("Processing an Insurance Claim", "processing-insurance-claim", "Verify patient coverage, attach required documentation, and submit the claim through the billing module.", "billing-finance"),
    ("Generating Payment Receipts", "generating-payment-receipts", "After payment is recorded, generate a receipt from the billing screen and provide it to the patient.", "billing-finance"),
    ("Understanding Billing Reports", "understanding-billing-reports", "Billing reports summarize daily revenue, outstanding claims, and payment method breakdowns.", "billing-finance"),
    ("Creating New User Accounts", "creating-new-user-accounts", "Admins can create accounts under System Administration, assigning an initial role and department.", "system-administration"),
    ("Assigning and Changing Roles", "assigning-changing-roles", "Only Admins can change a user's role. Navigate to user management and select the new role from the dropdown.", "system-administration"),
    ("Running a System Backup", "running-system-backup", "Backups run automatically daily. Manual backups can be triggered from the admin panel if needed before major updates.", "system-administration"),
    ("Data Privacy Guidelines", "data-privacy-guidelines", "Never enter real patient data into training or example content. Use synthetic data only, per compliance policy.", "compliance-security"),
    ("Reviewing Audit Logs", "reviewing-audit-logs", "Admins can review a log of all publishing and account changes, including who made each change and when.", "compliance-security"),
    ("Common Login Errors and Fixes", "common-login-errors-fixes", "Invalid credentials usually mean a typo in email or password. Locked accounts require IT to unlock them manually.", "troubleshooting"),
    ("What to Do When Search Returns No Results", "search-no-results", "Try broader search terms, check spelling, or browse by category instead if search doesn't find a match.", "troubleshooting"),
    ("Version 1.0 Release Notes", "version-1-release-notes", "Initial release of PulseDesk-KB, including knowledge base search, role-based accounts, and the embedded assistant widget.", "release-notes"),
]

count = 0
for title, slug, content, cat_slug in articles_data:
    existing = db.query(Article).filter(Article.slug == slug).first()
    if existing:
        continue
    article = Article(
        title=title,
        slug=slug,
        content=content,
        category_id=category_objects[cat_slug].id,
        author_id=ADMIN_ID,
        status="published",
    )
    db.add(article)
    count += 1

db.commit()
print(f"Admin account: admin@pulsedesk.test / admin12345")
print(f"Seeded {len(category_objects)} categories and {count} new articles.")
db.close()