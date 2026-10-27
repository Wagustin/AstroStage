## 2026-10-27 - Information Exposure in UI Error Messages
**Vulnerability:** The waitlist component exposed raw backend error payloads (`err.error?.error`, `err.error?.details`, or `err.message`) in the UI, potentially leaking internal database connections, server stack traces, or operational details (CWE-209).
**Learning:** Rendering uncaught backend error details or raw HTTP response fields in user-facing components exposes sensitive server architecture and operational details to potential attackers.
**Prevention:** Never expose raw backend error details or exception objects directly to end users. Always render generic, localized error messages in the client UI and keep detailed error logs on the server side or developer console.

## 2024-06-29 - Email HTML Injection & Info Leakage
**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.
