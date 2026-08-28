## 2026-08-28 - Frontend Error Response Data Exposure
**Vulnerability:** The Angular waitlist component (`waitlist.ts`) was rendering raw backend error payloads (`err.error?.error`, `err.error?.details`, `err.message`) in the UI, exposing internal system details to users during API failures.
**Learning:** Displaying raw error objects or server exception messages in client UI components can leak sensitive backend details, configuration parameters, or database error messages.
**Prevention:** Always display generic user-facing error messages in frontend error handlers while keeping detailed error logs strictly on backend/developer consoles.

## 2024-06-29 - Email HTML Injection & Info Leakage
**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.
