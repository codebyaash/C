# Google Sheets Sync Setup

Use this when you want the same expenses to appear on iPhone, laptop, and any other device.

## 1. Create the Sheet Backend

1. Create a new Google Sheet.
2. Rename the first sheet tab to `Expenses`.
3. Go to **Extensions -> Apps Script**.
4. Paste the contents of `google-apps-script.js` into the Apps Script editor.
5. Click **Deploy -> New deployment**.
6. Choose **Web app**.
7. Set **Execute as** to `Me`.
8. Set **Who has access** to `Anyone`.
9. Click **Deploy** and copy the Web App URL.

If you already deployed once, paste the latest `google-apps-script.js` code, then use **Deploy -> Manage deployments -> Edit -> New version -> Deploy**. GitHub Pages will not sync correctly until the deployed Apps Script version has the latest code.

## 2. Connect This App to the Sheet

Open `config.js` and paste the Web App URL:

```js
window.EXPENSE_APP_CONFIG = {
    SHEETS_WEB_APP_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec'
};
```

Use the URL ending in `/exec`. Do not use the `/dev` URL for the hosted iPhone/GitHub Pages app.

After that, the app will:

- Load expenses from the Google Sheet on startup.
- Add, edit, and delete phone/laptop updates back into the Sheet.
- Refresh from the Sheet when a tab regains focus and every 60 seconds.
- Keep using browser local storage if the Sheet is temporarily unavailable.

## 3. Sheet Columns

The backend creates/uses these columns:

```text
id, description, amount, category, date, spentBy, notes, createdAt, updatedAt
```

The `spentBy` column is the user tracker. The app also has an **All Users** filter in the Expenses tab.

## 4. Share a Link to iPhone

Host this folder as a static site. Good options:

- GitHub Pages: the link will look like `https://YOUR_GITHUB_USERNAME.github.io/Calculator/`.
- Netlify Drop: drag this folder into Netlify and use the generated `https://...netlify.app` link.

Open that hosted link in Safari on your iPhone. Use **Share -> Add to Home Screen** if you want it to behave like an app.

## Important Notes

- Do not use `file://.../index.html` on the iPhone for shared sync. It can save locally, but it will not give you a shareable link.
- Anyone with the hosted app link can write to the connected Sheet if your Apps Script is public.
- If you need private user accounts later, use Firebase or Supabase instead of public Apps Script.

## Troubleshooting

If the app says `Using local data. Sheet sync unavailable.`:

1. Confirm `config.js` has the `/exec` Web App URL.
2. Confirm the Apps Script deployment was updated to a new version after pasting the latest `google-apps-script.js`.
3. Open the Web App URL directly in a browser. It should show JSON with `ok` and `expenses`.
4. Confirm Apps Script access is set to `Anyone`.
