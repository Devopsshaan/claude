# Career Opportunity Research Pack: Google Form and Orders Sheet

`Code.gs` builds the customer form and its linked order-tracking sheet **inside your own
Google account**. You run it yourself, so Google asks you to sign in and approve access
directly. Your password never passes through anyone else.

## Run it (about 5 minutes)

1. Sign in to **mshanawazx@gmail.com** only. Use an incognito window if other accounts are
   signed in. Then open <https://script.google.com> and click **New project**.
2. Delete the sample code, paste the whole of `Code.gs`, and click **Save**.
3. Choose **`setup`** in the function dropdown and click **Run**. Approve the permission
   prompt for Forms, Sheets and triggers. If you see "Google hasn't verified this app", choose
   **Advanced → Go to project**. This is expected because the script is your own.
   The script refuses to run if you are signed in as a different account.
4. Open **View → Logs** (Execution log). It prints:
   - the **form edit URL**
   - the **customer URL** (this only works after you publish)
   - the **Orders sheet URL**
5. Run **`verify`**. Every line should say `PASS`.
6. Optional: run **`submitTestResponse`**. It sends one submission marked `TEST`, with no
   payment, so you can see it appear in both tabs of the sheet. Delete those rows afterwards.
7. Do the two manual steps below, review the form, and run **`publishForm`** only when you
   approve. It prints the public link and a short link. To close the form again, run
   **`unpublishForm`**.

## Manual steps the script cannot do

- **Theme colour**: Apps Script has no API for form themes. In the form editor, click the
  palette icon, choose a navy or dark-blue colour and keep the default font. Optionally add a
  header image.
- **Responder access when publishing**: In the **Publish** dialog, make sure responders are
  set to **Anyone with the link**. On a personal Gmail account forms never require Google
  sign-in. Turn off any "Restrict to users in…" option if one appears.
- **Mobile check**: Open the customer link on your phone and step through all 3 sections.
  Tap the PayPal link to confirm it opens. Type `abc` into Email address and confirm it is
  rejected.

## What gets configured

| Area | Setting |
|---|---|
| Sections | A: Personal Information (3 questions), B: Career Requirements (8), C: Payment (3 + PayPal instructions block) |
| Required | Name, Email, Country, Target role, Experience, Skills, Preferred countries, Job preference, PayPal transaction ID, both acknowledgments |
| Optional | LinkedIn/resume URL, Expected salary, Additional requirements |
| Email | Question 2 uses Google's "is email" validation. Google's built-in email collection is **off** so customers don't type their email twice. Set `useBuiltInEmailCollection: true` in `CONFIG` if you prefer the built-in field (it uses *Responder input*, which needs no sign-in). |
| Transaction ID | Accepts letters, numbers and dashes only (6–40 characters), so card numbers or free text are discouraged. |
| Sign-in | Not required. "Limit to 1 response" is off because turning it on would force Google sign-in. |
| Sensitive data | No question asks for documents, passport or card details. The payment and LinkedIn help text says not to share them. |
| Confirmation | Your exact thank-you message, including the support email |
| Before you approve | Form is created **unpublished and not accepting responses** |

## Orders sheet: "Career Research — Customer Orders"

- **Form Responses (do not edit)**: Google's raw response tab. Leave it untouched.
- **Orders**: your working tab. Each submission is copied here automatically with:
  Submission timestamp, Customer name, Customer email, Target role, Preferred countries,
  Experience, PayPal transaction ID, **Payment status**, **Order status**, Delivery deadline,
  Delivery date, Internal notes.
- New rows start as Payment status **Unverified** and Order status
  **Awaiting Payment Verification**. Nothing ever marks a payment as Verified automatically.
- Order status dropdown: New, Awaiting Payment Verification, In Research, Completed, Delivered.
- Payment status dropdown: Unverified, Verified, Invalid / Not found, Refunded.
- After you find the transaction for $10 USD in PayPal and set Payment status to
  **Verified**, the sheet fills in the Delivery deadline (now + 48 h) and moves the order to
  **In Research**.

## Limitations

- There is no automatic PayPal check. You verify each transaction ID in PayPal by hand.
- Responses that arrived before `setup` installed its triggers won't appear in Orders. Copy them
  over manually from the raw tab.
- If you rename questions in the form editor, update the titles in `Q` in `Code.gs`.
  Otherwise new Orders rows will have blank cells.
- No privacy policy is linked because none has been provided. The form only uses your
  privacy acknowledgment wording.
