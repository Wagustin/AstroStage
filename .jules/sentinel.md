## 2026-08-20 - Sensitive Error Detail Exposure in Angular UI

**Vulnerability:** `Waitlist` component in `src/app/components/waitlist/waitlist.ts` directly reflected backend error details (`err.error?.error`, `err.error?.details`, `err.message`) to the end-user interface.
**Learning:** Reflecting raw backend error objects or messages in the UI can leak sensitive infrastructure details, internal exception messages, or stack traces.
**Prevention:** Always log detailed error information on the console or server logs for developer debugging, but present a generic user-friendly error message to end users.

## 2024-06-29 - Email HTML Injection & Info Leakage

**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.
