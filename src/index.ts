import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import axios from 'axios'

const server = new McpServer({
  name: 'NYT Connections Answer',
  version: '1.0.0',
  capabilities: {
    resources: {},
    tools: {},
  },
})

server.tool(
  'nyt-connections-answer',
  'Check the Answers for the Connections Game on a Specific Date',
  { date: z.string().optional() },
  async ({ date }) => {
    const response = await axios.post('https://connectionshint.cc/api/connections/search', { date })
    const { code, data, message } = response.data

    if (code === 0) {
      return {
        content: [{ type: 'text', text: `Search Results: ${JSON.stringify(data)}` }],
      }
    } else {
      return {
        content: [{ type: 'text', text: `Search Failed, Error Code: ${code}, Message: ${message}` }],
      }
    }
  }
)

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.log('NYT Connections Answer MCP Server running on stdio')
}

main().catch((error) => {
  console.error('Fatal error in main():', error)
  process.exit(1)
})
