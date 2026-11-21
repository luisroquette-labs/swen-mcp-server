# ADR 0004: Canonical domains by locale

Status: Accepted

## Context

The original SWEN site uses `swen.ia.br` for Portuguese. English pages use `swen.live`. Existing Portuguese callers rely on the original URL helpers.

## Decision

Retain `swen.ia.br` as the default canonical domain and add locale aware helpers for English. Use the locale domain for Open Graph URLs and reciprocal hreflang links. Exclude Portuguese only pages from the English host. Keep the Instagram handle as `@swen.ia.br`.

## Consequences

Legacy callers keep Portuguese URLs. New bilingual callers must use the locale aware helpers. Domain, SEO, and public URL changes must be checked on both hosts.
