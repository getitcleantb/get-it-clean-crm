# Get It Clean CRM

The customer CRM for Get It Clean Tampa Bay. It's a website: open it in a browser on a phone or a computer, sign in, and it works like an app. On an iPhone, tap Share, then Add to Home Screen. On Android, tap the menu, then Add to Home screen or Install app.

## Where things live

- **This repository** holds only the website: the page (`index.html`), the Firebase code (`fb.js`), the settings for the Firebase project (`config.js`), the home-screen icons, the offline helper (`sw.js`) and the page customers see when they're texted an invoice (`i.html`). No customer data is ever stored here.
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

Booked estimates and jobs go straight onto the business calendar (getitclean.tb@gmail.com). A booking made on a crew phone, or while Google needs a reconnect, waits and is added by the owner's CRM the next time it's open and connected; the Calendar tab says how many are waiting.

## Texting (Quo)

Email & Texts has a text inbox and text blasts. Texts go out from the Quo business number through a small Google Apps Script in the business Google account, so the Quo API key never reaches a crew login and texting keeps working when the CRM is closed. The owner sets it up once, on a computer, under Settings > Texting: save the Quo API key, publish the security rules, paste the script and its settings at script.google.com, and run `textSetup`. Quo must also finish its US carrier registration (10DLC) before texts can go out.

Text invoice on an invoice writes a text to the number on the customer's lead with their first name, the total and a private link, and Send text sends it (or, before texting is set up, Open in Messages puts the same text in the phone's Messages app). Quo sends words only, so the link opens a view-only picture of the invoice (`i.html`) that the customer can save or print. The picture is kept in Firestore under `shared`, where the rules let anyone with its long random link open that one picture and nothing else; nobody can list them. Texting the invoice again uses the same link, a saved change to the invoice updates what it shows, putting the invoice on a different customer stops the old link, and deleting the invoice deletes the picture. Links only work once the rules from Settings > Texting are published.

Numbers that text STOP (or ask in other words) are never texted again unless they text START. Every text blast ends with "Reply STOP to opt out.", sends only 8 AM to 8 PM Eastern, and sends one text per number. Start asks the owner to confirm that everyone on it agreed to get texts. Vacation mode on the Email & Texts tab pauses email blasts, text blasts and drips.

## Money

Money has a Crew bonus button that opens a page with every paid job, who worked it, what it put in the business bank and who's in the lead, for paying a year-end bonus as a percentage. Add expense can repeat every month for bills like insurance or a lead subscription; those bills make up Monthly overhead on Money and are counted once a month on their bill day until they're stopped.

## Backups

Settings > Account > Backup downloads every lead, quote, job, expense and setting as one file. The same screen loads a backup file back in. Loading an older backup never undoes a do not contact, an opt-out, a bounce, a wrong number or a STOP saved since.

## Updates

Changes are made in the source and the built site is pushed to this repository. GitHub Pages picks it up within a minute or two. An open copy of the CRM loads the new version the next time it's opened.
