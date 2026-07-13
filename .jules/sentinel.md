## 2024-06-29 - Email HTML Injection & Info Leakage
**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.

## 2024-07-13 - Missing Payload Validation Leading to TypeErrors and Server Crashes
**Vulnerability:** The API endpoint `api/subscribe.ts` was susceptible to unhandled TypeErrors and Server Crashes (500) due to missing validation of the `req.body` object and its fields before destructuring and invoking string methods (e.g. `email.includes('@')`).
**Learning:** Vercel serverless functions receive raw request payloads. If `req.body` is null, undefined, or a non-object, attempting to destructure `email` from it can crash the function. Similarly, if `email` is not a string, invoking string methods on it will crash.
**Prevention:** Always explicitly validate that `req.body` exists and is an object, and strictly validate the type of expected fields before performing operations on them.
