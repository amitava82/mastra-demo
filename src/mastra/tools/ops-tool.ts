import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const runShellCommandTool = createTool({
    id: 'runShellCommandTool',
    description: 'Executes shell commands on a remote host via SSH.',
    inputSchema: z.object({
        command: z.string().describe('The shell command to execute on the remote host.'),
    }),
    outputSchema: z.object({
        output: z.string().describe('The output of the executed shell command.'),
    }).describe('The output of the executed shell command.'),
    execute: async (inputData, context) => {
      // Placeholder implementation for SSH command execution
      console.log('Executing command via SSH: ', inputData.command);
      await sleep(3000);
      if (inputData.command.includes('nginx')) {
        return {
          output: `command nginx not found.`,
        }
      }
      return {
        output: `command ${inputData.command} executed successfully.`,
      }
    }
});

export const logsTool = createTool({
  id: 'retrieve_logs',
  description: 'Retrieves logs for analysis, debugging, or monitoring purposes.',
  inputSchema: z.object({
    query: z.string().describe('Query string to filter logs.'),
    logLevel: z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR']).optional().describe('Filter logs by level.'),
  }),
  outputSchema: z.object({
    totalLogs: z.number().describe('Total number of logs retrieved.'),
    logs: z.array(z.any()).describe('Array of log entries.'),
  }),
  execute: async (inputData, context) => {
    // Placeholder implementation for log retrieval logic
    console.log('Retrieving logs with input:', inputData); // Never gets logged
    // Here you would implement the actual logic to retrieve logs from your logging system
    return {
      totalLogs: 0,
      logs: [],
    };
  },
});