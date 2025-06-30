# copilot-rules.md

## Overview

This document defines **project-specific rules, security requirements, workflow preferences, and best practices** for both GitHub Copilot and human contributors.
All team members and AI assistants must follow these guidelines to ensure consistent, secure, and high-quality contributions.

---

## 1. Security & Sensitive Data

### 🚨 **NEVER Upload or Commit Secrets**

* **Never** copy, move, or commit secret files or values (e.g., `.env`, `secrets.json`, `private.key`, API tokens, passwords) to version control or any committed file—even in example, sample, or backup files.
* **Never** auto-generate `.env.example` or similar files by copying from real secrets.
  Always create example config files by hand, using only safe placeholder values (e.g., `API_KEY=your-api-key-here`).
* **Never** reveal or suggest secrets in code comments, documentation, commit messages, or Copilot-generated output.
* **Always** verify that no secrets or sensitive values are present before staging, committing, or pushing code.
* If you discover a secret in version control, treat it as a security incident:

  1. Remove it from history.
  2. Rotate affected credentials immediately.
  3. Notify the team.
* **Enforcement:**

  * All secret/config files (like `.env`, `secrets.*`, `*.pem`, etc.) must be listed in `.gitignore`.
  * Use secret scanning tools (e.g., [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning), [TruffleHog](https://github.com/trufflesecurity/trufflehog), [git-secrets](https://github.com/awslabs/git-secrets)) as a backup.
* **For Copilot:**
  If Copilot attempts to generate code that exposes a secret, halt and ask the user for clarification.

---

## 2. Documentation & Memory Bank Hygiene

* **Always update relevant Memory Bank files** (`activeContext.md`, `progress.md`, etc.) when significant changes are made.
* **When new project patterns or decisions are discovered**, document them here for future contributors and Copilot.
* **Reference or link to external documentation** where appropriate—don’t duplicate content unnecessarily.
* **All controllers, services, and config files must include JSDoc documentation.**

---

## 3. Coding & Workflow Preferences

* **Follow established code style and formatting guidelines** for this project (see `systemPatterns.md` or language-specific configs).
* **Write atomic, descriptive commit messages**—summarize *what* changed and *why*.
* **When introducing new dependencies or tech**, update `techContext.md` and reference changes here if relevant.
* **Prioritize clarity over cleverness** in code and documentation—future readers (and AI) thank you!
* **Use async/await and explicit sleep for delays in API endpoints.**

---

## 4. When to Update This File

* After significant architectural, workflow, or security changes
* When a new rule, best practice, or pattern is established
* When a risk, vulnerability, or major process change is identified
* On explicit request via “update copilot-rules.md” or “update memory bank”

---

## 5. Project-Specific Patterns & Learnings

Add any evolving rules, exceptions, or helpful patterns here.
Examples:

* “Always use async APIs for I/O-bound tasks.”
* “Service layer must validate inputs before passing to DB.”
* “UI components must be tested with both light and dark themes.”
* “Never use `console.log` in production code.”
* “All controllers, services, and config files must include JSDoc documentation.”
* “Use async/await and explicit sleep for delays in API endpoints.”

---

## 6. References

* [GitHub Secret Scanning Documentation](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)
* [TruffleHog (Open Source Secret Scanner)](https://github.com/trufflesecurity/trufflehog)
* [git-secrets](https://github.com/awslabs/git-secrets)

---

## 🧠 Copilot & Contributor Workflow

* All contributors (human and AI) must follow the workflow and checklists defined in `.github/copilot-instructions.md`.
* Copilot must read all memory bank files at the start of every task (see checklist in the instructions file).
* Plan Mode and Act Mode must be followed for all significant work (see diagrams in `.github/copilot-instructions.md`).
* Memory Bank hygiene is required: update documentation as you work, and after significant changes.
* Documentation updates are a tracked deliverable, not just code/features.
* See `.github/copilot-instructions.md` for diagrams, checklists, and update triggers.

---

**REMEMBER:**
The rules in this document evolve with the project.
When in doubt, **ask for clarification before proceeding**.

---

*Last updated: 2025-06-30*
