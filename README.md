## Sample Project for mastra issue

This is a sample project to demonstrate the issue with mastra. https://github.com/mastra-ai/mastra/issues/10327

Configure .env with google gemini api key
```
npm run dev
```

Use sample prompt
```
User reporting checkout failures. Investigate root cause

```

### Scenario 1: Without any tools.
In this scenario, the agent has no tools configured. The agent should respond with a message indicating that no tools are available to perform the investigation.
However, the agent plans and then stops without any messages.

### Scenario 2: With tool configured.
Add `logsTool` in the `ops-agent.ts` file.

* If tool has no outputSchema configured:

Tool never gets called and I see error log:
```
 ERROR [2025-12-03 20:51:52.635 +0530] (Mastra): Error in agent stream
 finishReason: "error"
```

* If tool has outputSchema configured:

It attempts to call the tool several times and finally finsh with `finishReason: "tool-calls"`
