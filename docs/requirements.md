# PulseDesk-KB — Requirements Document

## 1. Functional Requirements

### Content Management
- Create, edit, and save articles as drafts
- Articles follow standardized templates (How-To, SOP, FAQ, Troubleshooting)
- Admin can review and publish/reject draft articles
- Articles can be tagged, categorized, and cross-linked

### Search & Discovery
- Full-text search across article titles, body, and tags
- Search results ranked by relevance
- Filter results by category

### Access Control
- Three roles: Viewer, Editor, Admin
- Viewers can read and give feedback only
- Editors can create/edit but not publish
- Admins can publish and manage users

### Knowledge Base Assistant (Chatbot)
- Embeddable chatbot widget (floating, bottom-right)
- Users ask questions in natural language
- Answers generated only from published KB articles (never invented)
- Every answer cites its source article

## 2. Non-Functional Requirements
- Page load under 3 seconds; search results under 500ms
- Passwords hashed with bcrypt; HTTPS enforced in production
- Input sanitized against SQL injection and XSS
- No real patient data anywhere in the system — synthetic examples only
- Responsive design (desktop, tablet, mobile)
- Accessible: keyboard navigation, sufficient color contrast

## 3. Content Requirements
- Article types: How-To Guide, SOP, FAQ, Feature Reference, Troubleshooting Guide, Release Notes
- Categories: Getting Started, Patient Management, Clinical Modules, Billing & Finance, System Administration, Compliance & Security, Troubleshooting, Release Notes
- Minimum content for demo: at least 5-8 sample articles across 3 categories (reduced from the original 24-article team target, since this is a solo build)

## 4. User Personas
- **Amina, Ward Nurse** — needs quick answers on registration, lab orders, discharge steps mid-shift; low tolerance for slow search; mobile/tablet user
- **David, IT Systems Admin** — manages accounts and configuration; needs detailed technical SOPs; publishes content
- **Grace, New Hire (Lab Technician)** — onboarding in first 2 weeks; needs structured, sequential guidance, not just snippets

## 5. Success Metrics
- Search success rate: user finds answer without escalating
- KB Assistant answer accuracy: correctly grounded in cited article
- KB Assistant deflection rate: resolved without needing support
- Article feedback rating: average user satisfaction score