# Get It Clean CRM

The customer CRM for Get It Clean Tampa Bay. It's a website: open it in a browser on a phone or a computer, sign in, and it works like an app. On an iPhone, tap Share, then Add to Home Screen. On Android, tap the menu, then Add to Home screen or Install app.

## Where things live

- **This repository** holds only the website: the page (`index.html`), the Firebase code (`fb.js`), the settings for the Firebase project (`config.js`), the home-screen icons and the offline helper (`sw.js`). No customer data is ever stored here.
- **Firebase** (in the business Google account) holds the sign-ins and all the CRM data: leads, quotes, jobs, expenses and settings.
- **GitHub Pages** serves this repository as the website.

The settings in `config.js` are public by design. Firebase keeps the data safe with the sign-in and the security rules below, not by hiding those settings.

## Who can get in

- The owner is the email in `config.js` (`owner`). The owner sees everything and manages the team under Settings > Account.
- Crew members are added by the owner under Settings > Account > Team, with their own email and a temporary password. Removing someone there turns their access off right away.

## Security rules

`firestore.rules` holds the rules for this site. They go in the Firebase console under Firestore Database > Rules: paste the whole file over what's there and tap Publish. They only need to be pasted again if this file changes.

## Google Calendar and Gmail

The CRM shows the owner's Google Calendar (three months back to a year ahead) on the Calendar and Today tabs and puts booked estimates and jobs on it. With Gmail connected, emails and quote PDFs go out from (or are saved as drafts in) the connected Gmail, and a lead's recent emails show on their Messages tab. It talks to Google straight from the browser, so there is no server and nothing to pay for.

One-time setup in the Google Cloud console for the Firebase project (`get-it-clean-tb-crm-5025b`):

1. Turn on the **Google Calendar API** and the **Gmail API** (APIs & Services > Library).
2. **Google Auth Platform** > Overview > Get started: app name "Get It Clean CRM", your email, audience **External**. Under **Audience**, add the Google accounts that will connect as **test users**; the app can stay in Testing.
3. **Clients** > Create client > **Web application**: authorized JavaScript origin `https://getitcleantb.github.io`, authorized redirect URI `https://getitcleantb.github.io/get-it-clean-crm/`.
4. Put the client ID (ends in `.apps.googleusercontent.com`) in `config.js` as `googleClientId`. It is public by design, like the rest of that file.

Each person connects their own Google account once per device from the Calendar tab (or Settings > Connections); one sign-in covers both Calendar and Gmail. Google's access lasts about an hour; the CRM quietly renews it when it's opened, and asks for one tap if Google wants a fresh sign-in. Google shows an "unverified app" notice because this is a private app; that's expected. Disconnect under Settings > Connections.

## Backups

Settings > Account > Backup downloads every lead, quote, job, expense and setting as one file. The same screen loads a backup file back in.

## Updates

Changes are made in the source and the built site is pushed to this repository. GitHub Pages picks it up within a minute or two. An open copy of the CRM loads the new version the next time it's opened.
