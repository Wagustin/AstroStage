## 2024-06-29 - Email HTML Injection & Info Leakage
**Vulnerability:** The API endpoint `api/subscribe.ts` was vulnerable to HTML Injection because it embedded the user-provided `email` directly into the HTML of the outgoing email without escaping. Additionally, it leaked internal server error messages to the client and trusted the `Host` header for generating the logo URL (Host Header Injection).
**Learning:** Even when sending emails, user input must be sanitized. Email clients render HTML, making them susceptible to injection attacks. Trusting user-provided headers like `Host` can lead to SSRF or phishing vectors in emails. Finally, exposing `error.message` to the client violates the "fail securely" principle.
**Prevention:** Always escape user input before embedding it in HTML. Never trust the `Host` header for constructing URLs sent in emails. Generic error messages should be returned for 500 errors.

## 2026-09-23 - Client-side Exposure of Backend Error Details
**Vulnerability:** The waitlist component rendered raw backend error objects, stack traces, and details in the UI upon subscription failure.
**Learning:** Displaying detailed backend error objects or messages in client components leaks internal system architecture and details to potential attackers.
**Prevention:** Catch HTTP error responses on the client and display a sanitized, generic user-friendly message rather than reflecting raw server error objects.
