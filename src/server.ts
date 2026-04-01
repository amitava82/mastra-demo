import 'dotenv/config';
import express from 'express';
import { MastraServer } from '@mastra/express';
import { handleChatStream } from '@mastra/ai-sdk';
import { toAISdkV5Messages } from '@mastra/ai-sdk/ui';
import { pipeUIMessageStreamToResponse } from 'ai';
import cors from 'cors';
import { mastra } from './mastra';

const app = express();
app.use(express.json()); // Required for body parsing
app.use(
    cors({
        origin: true,
    }),
);
const server = new MastraServer({ app, mastra });

await server.init();

app.post('/api/:agentId/stream', async (req, res) => {
    const { agentId } = req.params;
    const uiMessageStream = await handleChatStream({
        agentId,
        mastra,
        sendReasoning: true,
        version: 'v6',
        params: {
            ...req.body,
            memory: {
                resource: agentId,
                thread: {
                    id: req.body.id,
                    title: '',
                },
            },
        }
    });
    pipeUIMessageStreamToResponse({
        response: res,
        stream: uiMessageStream,
    });
});

app.get('/api/:threadId/messages', async (req, res) => {
    const { threadId } = req.params;
    const agent = mastra.getAgent('weatherAgent');
    const memory =  await agent.getMemory();
    const allMessages = await memory?.recall({ threadId, perPage: false });
    res.send(toAISdkV5Messages(allMessages?.messages || []));
});

const port = 4111;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});