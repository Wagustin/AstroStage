## 2024-06-29 - Email HTML Injection & Info Leakage
**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.
## 2024-08-02 - Unhandled TypeErrors on Vercel API Endpoints
**Vulnerability:** Missing validation of `req.body` and its properties in Vercel API endpoints can cause TypeErrors (e.g. when destructuring undefined or calling string methods on arrays/objects) leading to server crashes (DoS) and potential stack trace exposure.
**Learning:** Vercel API endpoints receive raw requests, so `req.body` cannot be trusted to be defined or of the expected type. Type validation must be performed before accessing properties or calling methods.
**Prevention:** Always validate the existence and type of `req.body` and its expected fields before interacting with them.
