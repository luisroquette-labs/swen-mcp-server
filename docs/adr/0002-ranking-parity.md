# ADR 0002: Ranking parity across clients

Status: Accepted

## Context

The SWEN site, iOS app, API v1, and MCP endpoint display Artificial Analysis rankings. Previously, equal scores could follow database order on the site while the app used another tie breaker. Configuration variants could also occupy multiple positions for one model.

## Decision

Sort by score descending, then cleaned model name ascending. Strip vendor prefixes and parenthesized configuration suffixes when identifying a model family. Keep the highest ranked configuration per family. Reuse `joinAndDedup` for API and MCP consumers; keep the equivalent rule in the iOS app aligned.

## Consequences

Changing names, sort order, or family keys requires a cross client parity check. The current top N fetchers use finite score limits, so very large or duplicate heavy data sets may need a different pagination strategy; see the issue for that risk.
