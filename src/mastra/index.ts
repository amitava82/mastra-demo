
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherAgent } from './agents/weather-agent';



export const mastra = new Mastra({
  agents: { weatherAgent },
  storage: new LibSQLStore({
    id: 'mastra-store',
    // stores observability, scores, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: "file:mastra.db",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'debug',
  }),
});
