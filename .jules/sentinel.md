## 2026-08-27 - Frontend Error Message Data Exposure

**Vulnerability:** The Angular `Waitlist` component in `src/app/components/waitlist/waitlist.ts` was exposing raw backend error properties (`err.error.error`, `err.error.details`, `err.message`) directly to the user UI interface.
**Learning:** Displaying raw backend error objects or exception details in frontend UI components leaks sensitive infrastructure, database, or internal logic details to untrusted clients.
**Prevention:** Always log detailed errors internally or to developer tools using `console.error` and present clients with generic, static user-friendly error messages.

## 2024-06-29 - Email HTML Injection & Info Leakage

**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.
