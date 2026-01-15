import 'dotenv/config';
import "reflect-metadata";
import { DaemoClient } from 'daemo-engine';
import { initializeDaemo, startConnection, stopConnection } from './services/daemoService';

async function main() {
    const systemPrompt = `You are an math expert. You are given a question and you need to answer it.`;
    const sessionData = initializeDaemo(systemPrompt);
    const hostedConnection = await startConnection(sessionData);

    const daemoClient = new DaemoClient({
        daemoAgentUrl: process.env.DAEMO_GATEWAY_URL,
        agentApiKey: process.env.DAEMO_AGENT_API_KEY,
    });

    const result = await daemoClient.processQuery("What is 2 to the power of 4?", {
        llmConfig: {
            provider: process.env.LLM_PROVIDER!,
            apiKey: process.env.LLM_API_KEY,
            model: process.env.LLM,
            maxTokens: 2048,
        },
    });

    console.log(result.response);
    stopConnection(hostedConnection);
}

main();