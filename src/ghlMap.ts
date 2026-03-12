export const ghlMap = `
GHL — MAPA COMPLETO CONSOLIDADO
Core Modules (navegación principal)
Launchpad
Dashboard
Conversations
Calendars
Contacts
Opportunities
Payments
AI Agents
Marketing
Sites
Memberships
Media Storage
Reputation
Reporting
App Marketplace
Settings
———
Launchpad
Recent activity feed
Upcoming appointments
Recent conversations
Tasks overview
Pipeline snapshot
Quick actions
Create contact
Create opportunity
Create appointment
Create task
Send message
———
Dashboard
Leads
Leads generated
Leads by source
Sales
Pipeline value
Closed deals
Revenue
Marketing
Funnel conversion
Page views
Communication
SMS sent
Emails sent
Calls made
Appointments
Bookings
Cancellations
No‑shows
———
Conversations
Channels
SMS
Email
WhatsApp
Facebook Messenger
Instagram DM
Google Business Messages
Live Chat
Website Chat Widget
Thread operations
Assign conversation
Add internal note
Tag conversation
Archive thread
Merge threads
Mark unread
Message operations
Send text
Send image
Send video
Send document
Send audio
Send location
Attachments
JPG
PNG
PDF
DOC
MP4
Conversation filters
Assigned user
Channel type
Unread status
Tags
Date range
Conversation automations
Auto assignment
Conversation routing
Conversation triggers
Message templates
SMS templates
Email templates
WhatsApp templates
SMS Snippets
Snippet title
Message body
Variables (ej: {{contact.first_name}})
Email Snippets
Snippet name
Subject
Email content
Usage in replies/templates
———
Calendars
Calendar types
Single user
Round robin
Collective
Configuration
Availability
Working hours
Time slots
Buffer time
Meeting duration
Location
Video link
Confirmation email
Reminder SMS
Routing
Round robin
Weighted distribution
Booking widgets
Link
iFrame embed
Popup widget
———
Contacts (CRM)
Contact fields
First name
Last name
Email
Phone
Address
City
State
Country
Zip
Company
Website
Timezone
Source
Assigned user
Timeline
SMS
Emails
Calls
Notes
Tasks
Appointments
Form submissions
Page visits
Smart lists
Tags
Custom fields
Pipeline stage
Engagement score
Bulk actions
Add tag
Remove tag
Assign user
Update field
Add to workflow
Remove from workflow
Send SMS
Send email
Export contacts
Delete contacts
Contact import
CSV import
Field mapping
Duplicate detection
Tag assignment
Contact deduplication
Email
Phone
Name
Companies (B2B CRM)
Company name
Domain
Employees
Revenue
Contacts linked to company
Relationships
———
Opportunities
Pipeline structure
Pipeline
Stages
Stage name
Stage order
Win probability
Opportunity fields
Opportunity name
Contact
Pipeline
Stage
Value
Owner
Close date
Statuses
Open
Won
Lost
Abandoned
Opportunity automation
Automatic stage movement
Triggers (appointment booked, payment received)
Forecasting
Expected revenue
Pipeline velocity
———
Payments
Products
Name
Price
Description
Billing type
One‑time
Subscription
Payment plan
Transactions
Customer
Product
Amount
Date
Status (Paid, Failed, Refunded)
Checkout pages
Product selector
Coupon input
Order bump
Terms checkbox
Coupons
Code
Discount amount
Expiration
Usage limits
Taxes
Tax rate
Region
———
AI Agents
Conversation AI
Lead qualification
Auto replies
Voice AI
AI outbound calls
AI call routing
Utilities
Summarization
Translation
Decision engine
AI Knowledge Bases
AI answering questions
AI support bots
Agent configuration
Prompt
Personality
Response rules
———
Marketing
Email campaign builder
Broadcast
Scheduled
RSS campaigns
Sender profile
Send window
Smart sending
Timezone optimization
Deliverability
Spam reports
Bounce types
SMS marketing
Mass messaging
Templates
Lead capture
Forms
Surveys
Quizzes
Social planner
Image posts
Video posts
Carousel posts
Scheduling (single, recurring)
Analytics (engagement, reach, click tracking)
Platforms: Facebook, Instagram, LinkedIn, Google Business
———
Sites
Funnels
Steps
Elements: Text, Image, Button, Video, Form, Survey, Countdown, Custom HTML
Websites
Pages
Navigation
Headers
Footers
Sections
Columns
Blocks
Text, Images, Videos, Forms, Buttons
Global elements
Global sections
Header
Footer
Navigation
SEO settings
Meta title
Meta description
OpenGraph tags
Blog builder
Posts
Categories
Author profiles
———
Memberships
Courses
Categories
Lessons
Lesson content (Video, Text, Attachments)
Access control
Offers / membership tiers
Community spaces
Discussion threads
Member messaging
Progress tracking
Lesson completion
Course completion
———
Media Storage
Images
Videos
PDF
Documents
Used in Funnels, Emails, Messages, Courses
———
Reputation
Platforms
Google Reviews
Facebook Reviews
Features
Review requests
Review tracking
Review responses
Reputation dashboard
Average rating
Review velocity
Review sources
Review funnel
SMS request
Email request
———
Reporting
Funnel analytics
Conversion rate
Drop‑off rate
Revenue per visitor
Attribution reports
Source
Campaign
Channel
Communication metrics
Email open rate
SMS reply rate
Call volume
Call duration
Appointment metrics
Bookings
No‑shows
———
App Marketplace
App categories
CRM tools
Communication tools
AI tools
Marketing tools
App permissions
Contacts access
Conversations access
CRM access
OAuth authorization
———
Settings
Business Profile
Business name
Business email
Business phone
Website
Address
Used for email sending & SMS compliance
My Profile
Name
Email
Phone
Profile photo
Communication settings
Caller ID
Voicemail
Billing
Plan type
Invoices
Payment methods
Billing history
My Staff
Name
Email
Role
Permissions
Contacts
Conversations
Funnels
Workflows
Billing
Email Services
Dedicated IP setup
Domain authentication
Bounce handling
Providers
Mailgun
SMTP
DNS
SPF
DKIM
DMARC
Phone System
Number management
Number pools
Ring groups
Call forwarding
Call recording
Voicemail
Call recording storage
Compliance
A2P 10DLC
STIR/SHAKEN
CNAM
WhatsApp
Business verification
Template approval
Two‑way messaging
Media attachments
Domains & URL Redirects
Domain verification
Redirect rules
Used for funnels/websites/memberships
DNS + SSL
Integrations
Native
Stripe
Twilio
Google Calendar
Facebook Ads
Google Ads
Automation
Zapier
Make
Storage
Google Drive
Private Integrations
API keys
Webhooks
External Tracking
Facebook Pixel
Google Analytics
TikTok Pixel
Custom Fields
Text
Number
Dropdown
Date
Checkbox
Custom Values
{{location.name}}
{{location.phone}}
{{location.email}}
Manage Scoring
Email opens
SMS replies
Page visits
Form submissions
Tags
Segmentation
Automation
Labs
Beta tools
Early releases
Audit Logs
User actions
Settings changes
Contact edits
Brand Boards
Logos
Brand colors
Fonts
Objects (Custom Objects)
Examples: Properties, Assets, Inventory
Fields, relationships, permissions (mencionado como capa de modelo)
———
Infrastructure Layers (no visibles en navegación)
LC Phone system
SaaS mode
Plan builder
Customer billing
Usage metering
Multi‑tenant architecture
API layer
Webhook engine
AI engine
Integration engine
WORKFLOWS — TRIGGERS (consolidado, sin repetir)
Contact
Birthday Reminder
Contact Changed
Contact Created
Contact DND
Contact Engagement Score
Contact Tag
Custom Date Reminder
Note Added
Note Changed
Task Added
Task Reminder
Task Completed
Events
Inbound Webhook
Scheduler
Call Details
Email Events
Customer Replied
Conversation AI Trigger
Custom Trigger
Form Submitted
Survey Submitted
Trigger Link Clicked
Facebook Lead Form Submitted
TikTok Form Submitted
Video Tracking
Number Validation
Messaging Error – SMS
LinkedIn Lead Form Submitted
Funnel/Website PageView
Quiz Submitted
New Review Received
Prospect Generated
Click To WhatsApp Ads
External Tracking Event
Appointments
Appointment Status
Customer Booked Appointment
Service Booking
Rental Booking
Opportunities
Opportunity Status Changed
Opportunity Created
Opportunity Changed
Pipeline Stage Changed
Stale Opportunities
Affiliate
Affiliate Created
New Affiliate Sales
Affiliate Enrolled In Campaign
Lead Created
Courses
Category Started
Category Completed
Lesson Started
Lesson Completed
New Signup
Offer Access Granted
Offer Access Removed
Product Access Granted
Product Access Removed
Product Started
Product Completed
User Login
Payments
Invoice
Payment Received
Order Form Submission
Order Submitted
Documents & Contracts
Estimates
Subscription
Refund
Coupon Code Applied
Coupon Redemption Limit Reached
Coupon Code Expired
Coupon Code Redeemed
Ecommerce Stores
Shopify Abandoned Cart (Deprecating Soon)
Shopify Order Placed
Shopify Order Fulfilled (Deprecating Soon)
Order Fulfilled
Product Review Submitted
Abandoned Checkout
IVR
Start IVR Trigger
Facebook/Instagram Events
Facebook – Comment(s) On A Post
Instagram – Comment(s) On A Post
Communities
Group Access Granted
Group Access Revoked
Private Channel Access Granted
Private Channel Access Revoked
Community Group Member Leaderboard Level Changed
Certificates
Certificates Issued
Communication
TikTok – Comment(s) On A Video
Transcript Generated
Google Ads
Google Lead Form Submitted
———
WORKFLOWS — ACTIONS (consolidado, sin repetir)
Contact Actions
Create Contact
Find Contact
Update Contact Field
Add Contact Tag
Remove Contact Tag
Assign to User
Remove Assigned User
Edit Conversation
Disable/Enable DND
Add Note
Add Task
Copy Contact
Delete Contact
Modify Contact Engagement Score
Add/Remove Contact Followers
Merge Contact
Communication Actions
Send Email
Send SMS
Send Slack Message
Call
Voicemail
Messenger
Instagram DM
Manual Action
GMB Messaging
Send Internal Notification
Send Review Request
Conversation AI
Facebook Interactive Messenger
Instagram Interactive Messenger
Reply in Comments
WhatsApp
Send Live Chat Message
Send Data
Webhook
Custom Webhook
Google Sheets
Internal Tools
If/Else
Wait
Goal Event
Split
Update Custom Value
Go To
Remove from Workflow
Arrays
Drip Mode
Text Formatter
Custom Code
Add to Workflow
Workflow AI / Eliza
AI Prompt (Workflow AI Action)
Eliza AI Appointment Booking
Send to Eliza Agent Platform
Appointments
Book Appointment
Update Appointment Status
Generate One Time Booking Link
Opportunities
Create/Update Opportunity
Remove Opportunity
Payments
Stripe One‑Time Charge
Send Invoice
Send Documents & Contracts
Send Estimate
Marketing
Add to Google Analytics
Add to Google AdWords
Add to Custom Audience (Facebook)
Remove from Custom Audience (Facebook)
Facebook Conversion API
Affiliate
Add to Affiliate Manager
Update Affiliate
Add/Remove from Affiliate Campaign
Courses
Course Grant Offer
Course Revoke Offer
IVR
Gather Input on Call
Play Message
Connect to Call
End Call
Record Voicemail
Communities
Grant Group Access
Revoke Group Access
Voice AI
Voice AI Outbound Call
———
WORKFLOWS — FILTERS (comunes por trigger/acción)
Contact tag
Contact owner
Contact field value
Custom fields
Contact engagement score
Pipeline
Pipeline stage
Opportunity value
Opportunity status
Calendar
Appointment status
Appointment owner
Message channel (SMS, Email, WhatsApp)
Message direction (Inbound/Outbound)
Form name
Funnel page
Survey name
Payment amount
Product purchased
Subscription status
Email opened
Email clicked
Email bounced
Email replied
Specific date
Relative date
Custom date field
`;
