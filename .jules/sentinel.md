## 2024-06-29 - Email HTML Injection & Info Leakage
**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.

## 2024-08-06 - Unhandled TypeError Server Crashes
**Vulnerability:** The Vercel API endpoints accepted request payloads blindly, trusting `req.body` to exist and to contain specific fields in specific string formats. Destructuring `req.body` without validating it's an object, or running `.includes()` on `email` without validating it's a string, leads to unhandled TypeErrors and Server Crashes (500 errors) when receiving malformed JSON payloads.
**Learning:** Vercel API handlers receive raw user input. We must treat `req.body` and its fields as completely untrusted data of any type (or null/undefined). Missing type validation leads to application instability.
**Prevention:** Always validate that `req.body` is a truthy object before destructuring. After destructuring, use `typeof` checks to ensure fields are the expected primitive type before invoking methods on them.
