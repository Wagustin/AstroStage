## 2024-06-29 - Email HTML Injection & Info Leakage

**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.

## 2026-08-22 - Error Response Information Disclosure

**Vulnerability:** The frontend `Waitlist` component displayed raw backend error messages/objects (`err.error?.error`, `err.error?.details`, `err.message`) directly to the user when API requests failed.
**Learning:** Returning or displaying detailed error object properties or system error messages on the client side can expose internal system architecture details, backend stack traces, or confidential error messages to potential attackers.
**Prevention:** Always display localized, generic error messages to end users while keeping detailed error logs internal to logging infrastructure.
