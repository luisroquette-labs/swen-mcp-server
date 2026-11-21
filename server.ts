#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createMcpServer } from './src/lib/api-v1/mcp-server.js'

const server = createMcpServer()
const transport = new StdioServerTransport()
await server.connect(transport)
