# ADR 0001: Public MCP contract and hosting

Status: Accepted

## Context

This repository mirrors selected source files from the SWEN production portal. The hosted MCP endpoint is `https://swen.ia.br/api/mcp`; `server.ts` and the Docker image provide a stdio reference for registries. The production endpoint uses Streamable HTTP and has its own hosting, authentication, and rate limiting. The two `NEXT_PUBLIC_SUPABASE_*` values in the Dockerfile are public browser values; database access depends on Row Level Security.

## Decision

The MCP endpoint offers the same public news, model, ranking, tool, and tutorial data as API v1. It requires no API key so agents can discover and cite SWEN content. Production limits requests by IP. The public response contains a summary and canonical article URL, never the full article body. MCP errors use the protocol's `isError` flag. API v1 maps internal database column names to a stable English contract.

Ranking and API fetches use a five minute cache fallback with separate invalidation tags, so data sync jobs can refresh results without expiring unrelated content.

## Consequences

The reference repository must stay aligned with production. Changes to the public contract or access policy require checking both implementations and their clients. The stdio image is not proof of production behavior.
