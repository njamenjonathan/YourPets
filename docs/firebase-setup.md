# Sign-in setup

Accounts on YourPets are handled by **Firebase Authentication**. There is no
other user store in this repository — `server.ts` has no accounts of its own —
so sign-in works only once Firebase is set up.

## Current state

The repository ships with `firebase-applet-config.json`, pointing at the
project **`ungoogly-league-pmbw7`**. That configuration is valid — the API key
is accepted and reaches a real project — but on that project:

| Setting                       | State        |
| ----------------------------- | ------------ |
| Email/Password sign-in        | **Disabled** |
| `localhost` authorised domain | **Missing**  |

Both were verified directly against Google's identity API:

```
accounts:signUp          -> OPERATION_NOT_ALLOWED
accounts:signInWithPassword -> PASSWORD_LOGIN_DISABLED
```

That is the whole reason registration returns HTTP 400. It is a project
setting, not a bug in this code, so it cannot be fixed by changing files here.

## Fix A — you have access to that Firebase project

1. Open <https://console.firebase.google.com/> and select **ungoogly-league-pmbw7**.
2. **Authentication → Sign-in method → Email/Password → Enable → Save.**
3. For local testing: **Authentication → Settings → Authorized domains → Add
   domain → `localhost`.** (Needed for Google sign-in; email/password works
   without it.)
4. Reload <http://localhost:3000> and register. No code change is required.

## Fix B — you do not have access to that project

Create your own project and point the site at it. **No committed file needs
editing** — put the values in `.env`:

1. <https://console.firebase.google.com/> → **Add project**.
2. Inside it: **Authentication → Get started → Email/Password → Enable.**
3. **Project settings → General → Your apps →** add a **Web app** if there is
   none, then open **SDK setup and configuration → Config**.
4. Copy these three values into `.env` in the project root:

   ```env
   VITE_FIREBASE_API_KEY="AIza..."          # config.apiKey
   VITE_FIREBASE_PROJECT_ID="my-project"    # config.projectId
   VITE_FIREBASE_APP_ID="1:123:web:abc"     # config.appId
   ```

   Optional, only if they differ from the defaults:

   ```env
   VITE_FIREBASE_AUTH_DOMAIN="my-project.firebaseapp.com"
   VITE_FIREBASE_STORAGE_BUCKET="my-project.appspot.com"
   VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
   VITE_FIREBASE_FIRESTORE_DATABASE_ID="(default)"
   ```

5. **Authentication → Settings → Authorized domains** → add `localhost`, and
   later your live domain.
6. Restart `npm run dev`. The console prints which project is in use.

If any of the three required values is missing the site falls back to the
bundled project, so a partly-filled `.env` will not silently half-work.

## Google sign-in

Already implemented and untouched. It needs, in the same project:
**Authentication → Sign-in method → Google → Enable**, and the domain you are
browsing from listed under **Authorized domains**. On `localhost` without that
entry it fails with `auth/unauthorized-domain`, and the site says so.

## What the customer sees when something is wrong

Each Firebase error has its own message — an existing email, a weak password,
a wrong password and a disabled provider no longer share one generic line. For
faults only you can fix, the browser console additionally prints the exact
remedy, for example:

```
[YourPets auth] auth/operation-not-allowed
  Email/Password sign-in is DISABLED in Firebase project "ungoogly-league-pmbw7".
  Fix: Firebase console -> Authentication -> Sign-in method -> Email/Password -> Enable. ...
```
