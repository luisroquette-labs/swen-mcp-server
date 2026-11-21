# ADR 0003: Relative benchmark freshness

Status: Accepted

## Context

An Artificial Analysis model changed slug in 2026. The old database row retained a higher, frozen score and appeared above current results. A clock based cutoff would also hide all results during a complete sync outage.

## Decision

For one benchmark, discard dated scores more than ten days older than its newest dated score. Preserve undated entries, which include manually maintained benchmarks. A separate sync health monitor handles full source outages.

## Consequences

The cutoff prevents individual orphan rows from dominating a ranking while preserving a fully stale set during a source outage. It does not correct the orphaned database row; the producer must still reconcile changed model identifiers.
