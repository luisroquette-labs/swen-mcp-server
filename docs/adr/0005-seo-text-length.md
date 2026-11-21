# ADR 0005: SEO text length

Status: Accepted

## Context

Some news page titles and descriptions exceeded the intended search result lengths. Cutting a string at an arbitrary character can split a word.

## Decision

`truncateForSeo` leaves short text intact and prefers the last word boundary near the requested limit. If no suitable boundary exists, it cuts at the limit and adds an ellipsis. Callers choose the limit for their title or description context.

## Consequences

The function is a display helper, not proof of how a search engine will render a result. Changing its cutoff rule can alter public snippets and should be checked on representative pages.
