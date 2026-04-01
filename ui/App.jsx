import { useChat } from '@ai-sdk/react'
import React, { useState, useCallback } from 'react'
import { isToolUIPart, getToolName, DefaultChatTransport } from "ai";
import { CircularProgress, Input, OutlinedInput, Button, Box, Typography } from '@mui/material';
import {Conversation} from './components/conversation.jsx';
import { Message, MessageContent } from './components/message.jsx'
import { Tool, ToolContent, ToolOutput, ToolInput, ToolHeader } from './components/tool.jsx';

function isToolCallApproval(
  part,
) {
  return part.type === "data-tool-call-approval" && "data" in part;
}

function getApprovalForToolCall(
  parts,
  toolCallId,
) {
  const part = parts.find(
    (p) => isToolCallApproval(p) && p.data.toolCallId === toolCallId,
  );
  return part && isToolCallApproval(part) ? part.data : undefined;
}



export default function Chat() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `http://localhost:4111/api/weatherAgent/stream`,
    }),
  });

  console.log(messages);

  const isLoading = status === "streaming" || status === "submitted";

  const handleApproval = useCallback(
    async (data, approved) => {
      await sendMessage(undefined, {
        body: {
          resumeData: { approved },
          runId: data.runId,
        },
      });
    },
    [sendMessage],
  );

  const handleSubmit = () => {
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="max-w-4xl mx-auto p-0 md:p-6 relative size-full">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
            {messages.map((message) => (
              <div key={message.id}>
                {message.parts.map((part, i) => {
                  if (part.type === "text" && part.text.length > 0) {
                    return (
                      <Message key={i} from={message.role}>
                        <MessageContent>
                          <Typography>{part.text}</Typography>
                        </MessageContent>
                      </Message>
                    );
                  }

                  // Skip the standalone data-tool-call-approval part — its data
                  // is rendered inline inside the corresponding tool-* part below.
                  if (isToolCallApproval(part)) {
                    return null;
                  }

                  if (isToolUIPart(part)) {
                    const approval = getApprovalForToolCall(
                      message.parts,
                      part.toolCallId,
                    );

                    // No approval needed — render normally
                    if (!approval) {
                      return (
                        <Tool key={i}>
                          <ToolHeader
                            title={getToolName(part)}
                            type={part.type}
                            state={part.state}
                          />
                          <ToolContent>
                            <ToolOutput
                              output={part.output}
                              errorText={part.errorText}
                            />
                          </ToolContent>
                        </Tool>
                      );
                    }

                    const awaitingApproval =
                      part.state !== "output-available" &&
                      part.state !== "output-error" &&
                      !isLoading;

                    return (
                      <Tool
                        key={i}
                        open={awaitingApproval || undefined}
                        defaultOpen
                      >
                        <ToolHeader
                          title={getToolName(part)}
                          type={part.type}
                          state={part.state}
                        />
                        <ToolContent>
                          <ToolInput input={approval.args} />
                          {part.state === "output-available" ? (
                            <ToolOutput
                              output={part.output}
                              errorText={part.errorText}
                            />
                          ) : (
                            <div className="p-4 pt-0">
                              <div className="flex items-center gap-2 mb-3 text-sm font-medium text-amber-600 dark:text-amber-400">
                                <span>Approval required</span>
                              </div>
                              {isLoading ? (
                                <p className="text-sm text-muted-foreground">
                                  Processing...
                                </p>
                              ) : (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleApproval(approval, true)
                                    }
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      handleApproval(approval, false)
                                    }
                                  >
                                    Decline
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </ToolContent>
                      </Tool>
                    );
                  }

                  return null;
                })}
              </div>
            ))}
            {status === "submitted" && <CircularProgress />}
        </Conversation>
        <OutlinedInput
          margin="dense"
          fullWidth value={input} onChange={e => setInput(e.target.value)} />
        <Button variant="contained" loading={isLoading} onClick={handleSubmit}>Send</Button>
      </div>
    </div>
  );
}