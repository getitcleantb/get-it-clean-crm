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

## Backups

Settings > Account > Backup downloads every lead, quote, job, expense and setting as one file. The same screen loads a backup file back in.

## Updates

Changes are made in the source and the built site is pushed to this repository. GitHub Pages picks it up within a minute or two. An open copy of the CRM loads the new version the next time it's opened.
