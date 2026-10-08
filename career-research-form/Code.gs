/**
 * Career Opportunity Research Pack — Google Form + Orders Sheet builder.
 *
 * Run this in YOUR OWN Google account (mshanawazx@gmail.com) at
 * https://script.google.com. See README.md for the step-by-step.
 *
 * Functions you run, in order:
 *   1. setup()        Creates the form (UNPUBLISHED, not accepting responses),
 *                     the linked sheet, the Orders tab and the triggers.
 *   2. verify()       Checks every question, the email validation, the PayPal
 *                     link and the settings, and logs a pass/fail report.
 *   3. publishForm()  Only after you have reviewed and approved the form.
 *   4. submitTestResponse()  Optional: one clearly marked test submission
 *                     to prove responses reach the sheet. No payment involved.
 */

const CONFIG = {
  formTitle: 'Career Opportunity Research — Customer Request',
  formDescription:
    'Get personalized job opportunity research for $10 USD. ' +
    'Complete your details below so we can prepare your research pack.',
  sheetName: 'Career Research — Customer Orders',
  paypalUrl: 'https://www.paypal.com/ncp/payment/2JJVS3ZBCNYKQ',
  supportEmail: 'mshanawazx@gmail.com',
  // Question 2 already asks for (and validates) the email address. Turning on
  // Google's built-in "Responder input" email collection as well would make
  // customers type their email twice, so it is off by default.
  useBuiltInEmailCollection: false,
};

const SERVICE_DESCRIPTION =
  'We provide personalized research of up to 10 relevant job opportunities based on your ' +
  'experience, skills, target role and preferred countries. Your research pack includes ' +
  'available official application links and publicly available recruiter outreach channels. ' +
  'Delivery is within 48 hours after receiving complete information and verified payment.\n\n' +
  'This is an independent career research service. We do not guarantee jobs, interviews, ' +
  'referrals, visa sponsorship or placement.';

const PAYMENT_INSTRUCTIONS =
  'Career Opportunity Research Pack: $10 USD.\n\n' +
  'Pay securely using PayPal:\n' +
  CONFIG.paypalUrl + '\n\n' +
  'After completing payment, return to this form and enter your PayPal transaction ID. ' +
  'Your order will be processed only after payment is verified.';

const CONFIRMATION_MESSAGE =
  'Thank you for submitting your career research request!\n\n' +
  'We will verify your PayPal payment and review your requirements.\n\n' +
  'Your personalized research pack will be delivered to your email within 48 hours after ' +
  'receiving complete details and verified payment.\n\n' +
  'For assistance, contact ' + CONFIG.supportEmail + '.';

const SERVICE_ACK =
  'I understand that this is a paid independent job research service, not a recruitment or ' +
  'placement service. No job, interview, referral or visa sponsorship is guaranteed.';

const PRIVACY_ACK =
  'I understand that my submitted information will be used to prepare and deliver my ' +
  'requested research pack.';

// Question titles. The Orders tab reads responses by these exact titles.
const Q = {
  name: 'Full name',
  email: 'Email address',
  country: 'Current country of residence',
  role: 'Target job title',
  experience: 'Years of professional experience',
  skills: 'Key skills and technologies',
  countries: 'Preferred employment countries',
  preference: 'Job preference',
  linkedin: 'LinkedIn profile or resume URL',
  salary: 'Expected salary and currency',
  extra: 'Additional job requirements',
  txn: 'PayPal transaction ID',
  serviceAck: 'Service acknowledgment',
  privacyAck: 'Privacy acknowledgment',
};

const REQUIRED_TITLES = [
  Q.name, Q.email, Q.country, Q.role, Q.experience, Q.skills, Q.countries,
  Q.preference, Q.txn, Q.serviceAck, Q.privacyAck,
];

const ORDERS_TAB = 'Orders';
const ORDERS_HEADERS = [
  'Submission timestamp', 'Customer name', 'Customer email', 'Target role',
  'Preferred countries', 'Experience', 'PayPal transaction ID',
  'Payment status', 'Order status', 'Delivery deadline', 'Delivery date', 'Internal notes',
];
const COL = {}; ORDERS_HEADERS.forEach((h, i) => { COL[h] = i + 1; });

// Payment is never marked Verified automatically — only by you, after checking PayPal.
const PAYMENT_STATUSES = ['Unverified', 'Verified', 'Invalid / Not found', 'Refunded'];
const ORDER_STATUSES = ['New', 'Awaiting Payment Verification', 'In Research', 'Completed', 'Delivered'];

const NAVY = '#1a2b5f';
const PROPS = PropertiesService.getScriptProperties();

// ---------------------------------------------------------------------------
// 1. Setup
// ---------------------------------------------------------------------------

function setup() {
  if (PROPS.getProperty('FORM_ID')) {
    throw new Error('Setup already ran (form ' + PROPS.getProperty('FORM_ID') + '). ' +
      'Delete the FORM_ID / SHEET_ID script properties first if you really want a second copy.');
  }
  const owner = Session.getActiveUser().getEmail();
  if (owner && owner.toLowerCase() !== CONFIG.supportEmail.toLowerCase()) {
    throw new Error('Signed in as ' + owner + ', expected ' + CONFIG.supportEmail +
      '. Switch accounts at script.google.com and run again.');
  }

  const form = buildForm_();
  const ss = linkSheet_(form);
  buildOrdersTab_(ss);
  installTriggers_(ss);

  PROPS.setProperty('FORM_ID', form.getId());
  PROPS.setProperty('SHEET_ID', ss.getId());

  Logger.log('Form created (NOT published yet).');
  Logger.log('Edit form:     ' + form.getEditUrl());
  Logger.log('Customer link: ' + form.getPublishedUrl() + '  (works only after publishForm)');
  Logger.log('Orders sheet:  ' + ss.getUrl());
  Logger.log('Next: run verify(), review the form, then run publishForm() when you approve.');
}

function buildForm_() {
  const form = FormApp.create(CONFIG.formTitle);
  form.setDescription(CONFIG.formDescription + '\n\n' + SERVICE_DESCRIPTION)
    .setConfirmationMessage(CONFIRMATION_MESSAGE)
    .setProgressBar(true)
    .setShowLinkToRespondAgain(false)
    .setAllowResponseEdits(false)
    .setLimitOneResponsePerUser(false)   // true would force Google sign-in
    .setCollectEmail(false);

  // Keep the form closed until you approve publishing.
  form.setAcceptingResponses(false);
  form.setCustomClosedFormMessage(
    'This form is not open yet. Please check back soon or contact ' + CONFIG.supportEmail + '.');
  if (typeof form.setPublished === 'function') form.setPublished(false);

  // Workspace-only setting; consumer Gmail forms never require sign-in.
  try { form.setRequireLogin(false); } catch (e) { /* not available on consumer accounts */ }

  if (CONFIG.useBuiltInEmailCollection) {
    try {
      form.setEmailCollectionType(FormApp.EmailCollectionType.RESPONDER_INPUT);
    } catch (e) {
      Logger.log('Built-in email collection type not supported here: ' + e.message);
    }
  }

  // Section A — Personal Information (first page)
  form.addSectionHeaderItem().setTitle('Section A — Personal Information');
  form.addTextItem().setTitle(Q.name).setRequired(true);
  form.addTextItem().setTitle(Q.email).setRequired(true)
    .setHelpText('Your research pack will be delivered to this address.')
    .setValidation(FormApp.createTextValidation()
      .requireTextIsEmail()
      .setHelpText('Please enter a valid email address, e.g. name@example.com')
      .build());
  form.addTextItem().setTitle(Q.country).setRequired(true);

  // Section B — Career Requirements
  form.addPageBreakItem().setTitle('Section B — Career Requirements');
  form.addTextItem().setTitle(Q.role).setRequired(true)
    .setHelpText('e.g. Senior DevOps Engineer');
  form.addTextItem().setTitle(Q.experience).setRequired(true)
    .setHelpText('e.g. 6 years');
  form.addParagraphTextItem().setTitle(Q.skills).setRequired(true);
  form.addParagraphTextItem().setTitle(Q.countries).setRequired(true)
    .setHelpText('List the countries where you would like to work.');
  form.addMultipleChoiceItem().setTitle(Q.preference).setRequired(true)
    .setChoiceValues(['Remote', 'Relocation', 'Both']);
  form.addTextItem().setTitle(Q.linkedin).setRequired(false)
    .setHelpText('Optional. Please share a link only — do not upload identity documents.');
  form.addTextItem().setTitle(Q.salary).setRequired(false)
    .setHelpText('Optional. e.g. 60,000 EUR per year');
  form.addParagraphTextItem().setTitle(Q.extra).setRequired(false);

  // Section C — Payment
  form.addPageBreakItem().setTitle('Section C — Payment')
    .setHelpText(PAYMENT_INSTRUCTIONS);
  form.addSectionHeaderItem().setTitle('💳 Pay $10 USD with PayPal')
    .setHelpText(CONFIG.paypalUrl + '\n\nOpen the link above, complete payment, then come back ' +
      'and enter your transaction ID below. Never enter card details in this form.');
  form.addTextItem().setTitle(Q.txn).setRequired(true)
    .setHelpText('Found in your PayPal receipt email or PayPal activity (e.g. 1AB23456CD789012E).')
    .setValidation(FormApp.createTextValidation()
      .requireTextMatchesPattern('^[A-Za-z0-9-]{6,40}$')
      .setHelpText('Please enter the transaction ID only (letters and numbers).')
      .build());
  form.addCheckboxItem().setTitle(Q.serviceAck).setRequired(true)
    .setChoiceValues([SERVICE_ACK]);
  form.addCheckboxItem().setTitle(Q.privacyAck).setRequired(true)
    .setChoiceValues([PRIVACY_ACK]);

  return form;
}

function linkSheet_(form) {
  const ss = SpreadsheetApp.create(CONFIG.sheetName);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  SpreadsheetApp.flush();

  // Rename the form's response tab so it is obviously "do not edit".
  const responses = ss.getSheets().find(s => s.getFormUrl());
  if (responses) {
    responses.setName('Form Responses (do not edit)');
    responses.setTabColor('#9e9e9e');
  }
  // Remove the empty default tab created with the spreadsheet.
  const blank = ss.getSheetByName('Sheet1');
  if (blank && ss.getSheets().length > 1) ss.deleteSheet(blank);
  return ss;
}

function buildOrdersTab_(ss) {
  const sh = ss.insertSheet(ORDERS_TAB, 0);
  sh.setTabColor(NAVY);
  sh.getRange(1, 1, 1, ORDERS_HEADERS.length).setValues([ORDERS_HEADERS])
    .setFontWeight('bold').setFontColor('#ffffff').setBackground(NAVY).setWrap(true);
  sh.setFrozenRows(1);
  sh.setColumnWidths(1, ORDERS_HEADERS.length, 160);
  sh.setColumnWidth(COL['Internal notes'], 300);

  const rows = sh.getMaxRows() - 1;
  sh.getRange(2, COL['Payment status'], rows).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(PAYMENT_STATUSES, true)
      .setAllowInvalid(false).build());
  sh.getRange(2, COL['Order status'], rows).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(ORDER_STATUSES, true)
      .setAllowInvalid(false).build());
  sh.getRange(2, COL['Submission timestamp'], rows).setNumberFormat('yyyy-mm-dd hh:mm');
  sh.getRange(2, COL['Delivery deadline'], rows).setNumberFormat('yyyy-mm-dd hh:mm');
  sh.getRange(2, COL['Delivery date'], rows).setNumberFormat('yyyy-mm-dd hh:mm');

  // Colour the payment column so unverified payments stand out.
  const pay = sh.getRange(2, COL['Payment status'], rows);
  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Unverified')
      .setBackground('#fff4cc').setRanges([pay]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Verified')
      .setBackground('#d9f2e3').setRanges([pay]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Invalid / Not found')
      .setBackground('#f8d7da').setRanges([pay]).build(),
  ]);

  sh.getRange(1, COL['Payment status']).setNote(
    'Set to "Verified" ONLY after you find the transaction ID in your PayPal account ' +
    'for $10 USD. A customer entering an ID does not mean payment succeeded.');
  sh.getRange(1, COL['Delivery deadline']).setNote(
    'Filled automatically with now + 48h when you set Payment status to "Verified".');
}

function installTriggers_(ss) {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('onOrderSubmitted').forSpreadsheet(ss).onFormSubmit().create();
  ScriptApp.newTrigger('onOrdersEdited').forSpreadsheet(ss).onEdit().create();
}

// ---------------------------------------------------------------------------
// Triggers
// ---------------------------------------------------------------------------

/** Copies each new form response into the Orders tab with tracking defaults. */
function onOrderSubmitted(e) {
  const v = e.namedValues;
  const get = title => (v[title] && v[title][0]) || '';
  const sh = SpreadsheetApp.openById(PROPS.getProperty('SHEET_ID')).getSheetByName(ORDERS_TAB);
  const row = new Array(ORDERS_HEADERS.length).fill('');
  // Read the timestamp cell itself (a real Date) rather than parsing a locale string.
  row[COL['Submission timestamp'] - 1] = e.range.getCell(1, 1).getValue() || new Date();
  row[COL['Customer name'] - 1] = get(Q.name);
  row[COL['Customer email'] - 1] = get(Q.email);
  row[COL['Target role'] - 1] = get(Q.role);
  row[COL['Preferred countries'] - 1] = get(Q.countries);
  row[COL['Experience'] - 1] = get(Q.experience);
  // Prefix with ' so long numeric IDs are kept as text, not turned into numbers.
  row[COL['PayPal transaction ID'] - 1] = "'" + get(Q.txn);
  row[COL['Payment status'] - 1] = 'Unverified';
  row[COL['Order status'] - 1] = 'Awaiting Payment Verification';
  if (/^TEST-/i.test(get(Q.txn))) row[COL['Internal notes'] - 1] = 'TEST SUBMISSION — not a real order';
  sh.appendRow(row);
}

/** When you mark a payment Verified, stamps the 48h delivery deadline once. */
function onOrdersEdited(e) {
  const sh = e.range.getSheet();
  if (sh.getName() !== ORDERS_TAB || e.range.getRow() < 2) return;
  if (e.range.getColumn() !== COL['Payment status'] || e.value !== 'Verified') return;
  const deadline = sh.getRange(e.range.getRow(), COL['Delivery deadline']);
  if (!deadline.getValue()) {
    deadline.setValue(new Date(Date.now() + 48 * 60 * 60 * 1000));
    const status = sh.getRange(e.range.getRow(), COL['Order status']);
    if (status.getValue() === 'Awaiting Payment Verification' || status.getValue() === 'New') {
      status.setValue('In Research');
    }
  }
}

// ---------------------------------------------------------------------------
// 2. Verify
// ---------------------------------------------------------------------------

function verify() {
  const form = FormApp.openById(PROPS.getProperty('FORM_ID'));
  const ss = SpreadsheetApp.openById(PROPS.getProperty('SHEET_ID'));
  const items = form.getItems();
  const byTitle = {};
  items.forEach(it => { byTitle[it.getTitle()] = it; });
  const results = [];
  const check = (label, ok) => results.push((ok ? 'PASS ' : 'FAIL ') + label);

  Object.values(Q).forEach(t => check('Question exists: ' + t, !!byTitle[t]));
  REQUIRED_TITLES.forEach(t => {
    const it = byTitle[t];
    check('Required: ' + t, !!it && asTyped_(it).isRequired());
  });
  [Q.linkedin, Q.salary, Q.extra].forEach(t => {
    const it = byTitle[t];
    check('Optional: ' + t, !!it && !asTyped_(it).isRequired());
  });
  check('Job preference choices = Remote/Relocation/Both',
    byTitle[Q.preference] && byTitle[Q.preference].asMultipleChoiceItem().getChoices()
      .map(c => c.getValue()).join('|') === 'Remote|Relocation|Both');

  const allText = items.map(it => it.getTitle() + ' ' + it.getHelpText()).join('\n');
  check('PayPal link present and exact', allText.indexOf(CONFIG.paypalUrl) !== -1);
  check('Form linked to the Orders sheet', form.getDestinationId() === ss.getId());
  check('Orders tab exists', !!ss.getSheetByName(ORDERS_TAB));
  check('Confirmation message set', form.getConfirmationMessage() === CONFIRMATION_MESSAGE);
  check('One-response-per-user OFF (no sign-in needed)', !form.hasLimitOneResponsePerUser());
  try { check('Sign-in NOT required', !form.requiresLogin()); }
  catch (e) { results.push('INFO Sign-in requirement not applicable (consumer account: never required)'); }
  check('Submit triggers installed',
    ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === 'onOrderSubmitted'));
  results.push('INFO Accepting responses: ' + form.isAcceptingResponses());
  if (typeof form.isPublished === 'function') results.push('INFO Published: ' + form.isPublished());
  results.push('INFO Email validation: open the customer link and type "abc" into ' +
    '"Email address" — it must be rejected.');

  Logger.log(results.join('\n'));
  const failed = results.filter(r => r.indexOf('FAIL') === 0).length;
  Logger.log(failed ? failed + ' check(s) FAILED' : 'All checks passed.');
}

function asTyped_(item) {
  switch (item.getType()) {
    case FormApp.ItemType.TEXT: return item.asTextItem();
    case FormApp.ItemType.PARAGRAPH_TEXT: return item.asParagraphTextItem();
    case FormApp.ItemType.MULTIPLE_CHOICE: return item.asMultipleChoiceItem();
    case FormApp.ItemType.CHECKBOX: return item.asCheckboxItem();
    default: throw new Error('Unexpected item type for ' + item.getTitle());
  }
}

// ---------------------------------------------------------------------------
// 3. Publish (only after you approve)
// ---------------------------------------------------------------------------

function publishForm() {
  const form = FormApp.openById(PROPS.getProperty('FORM_ID'));
  if (typeof form.setPublished === 'function') form.setPublished(true);
  form.setAcceptingResponses(true);
  Logger.log('Form is live. Share this link with customers: ' + form.getPublishedUrl());
  Logger.log('Short link: ' + form.shortenFormUrl(form.getPublishedUrl()));
}

function unpublishForm() {
  const form = FormApp.openById(PROPS.getProperty('FORM_ID'));
  form.setAcceptingResponses(false);
  if (typeof form.setPublished === 'function') form.setPublished(false);
  Logger.log('Form closed to new responses.');
}

// ---------------------------------------------------------------------------
// 4. Test submission (no payment)
// ---------------------------------------------------------------------------

/** Submits one fake response marked TEST so you can see it land in the sheet. */
function submitTestResponse() {
  const form = FormApp.openById(PROPS.getProperty('FORM_ID'));
  const wasOpen = form.isAcceptingResponses();
  if (!wasOpen) form.setAcceptingResponses(true);
  try {
    const answers = {};
    answers[Q.name] = 'Test Customer';
    answers[Q.email] = CONFIG.supportEmail;
    answers[Q.country] = 'Testland';
    answers[Q.role] = 'Test Engineer';
    answers[Q.experience] = '5 years';
    answers[Q.skills] = 'Testing only — not a real order';
    answers[Q.countries] = 'Germany, Netherlands';
    answers[Q.txn] = 'TEST-NOT-A-PAYMENT';

    const resp = form.createResponse();
    form.getItems().forEach(it => {
      const t = it.getTitle();
      if (answers[t] !== undefined) {
        resp.withItemResponse(asTyped_(it).createResponse(answers[t]));
      } else if (t === Q.preference) {
        resp.withItemResponse(it.asMultipleChoiceItem().createResponse('Both'));
      } else if (t === Q.serviceAck) {
        resp.withItemResponse(it.asCheckboxItem().createResponse([SERVICE_ACK]));
      } else if (t === Q.privacyAck) {
        resp.withItemResponse(it.asCheckboxItem().createResponse([PRIVACY_ACK]));
      }
    });
    resp.submit();
  } finally {
    if (!wasOpen) form.setAcceptingResponses(false);
  }
  Logger.log('Test response submitted. Check the "Form Responses" and "Orders" tabs in ' +
    SpreadsheetApp.openById(PROPS.getProperty('SHEET_ID')).getUrl() +
    ' — then delete the TEST rows from both tabs.');
}
