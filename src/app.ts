import 'dotenv/config';
import "reflect-metadata";
import { DaemoBuilder, DaemoClient, DaemoHostedConnection, SessionData } from 'daemo-engine';
import { CalculatorService } from './services/CalculatorService';

function initializeDaemo(systemPrompt: string) {
    const sessionData = new DaemoBuilder()
        .withServiceName("calculator_service")
        .withSystemPrompt(systemPrompt)
        .registerService(new CalculatorService())
        .build();
    sessionData.Port = 50052;
    console.log("Session data initialized!");
    return sessionData;
}

async function startConnection(sessionData: SessionData) {
    const hostedConnection = new DaemoHostedConnection({
        daemoGatewayUrl: process.env.DAEMO_GATEWAY_URL,
        agentApiKey: process.env.DAEMO_AGENT_API_KEY,
    }, sessionData);
    await hostedConnection.start();
    console.log("Connection started!");
    return hostedConnection;
}

function stopConnection(hostedConnection: DaemoHostedConnection) {
    hostedConnection.stop();
    console.log("Connection stopped...");
}

async function main() {
    const systemPrompt = `You are an math expert. You are given a question and you need to answer it.`;
    const sessionData = initializeDaemo(systemPrompt);
    const hostedConnection = await startConnection(sessionData);

    const daemoClient = new DaemoClient({
        daemoAgentUrl: process.env.DAEMO_GATEWAY_URL,
        agentApiKey: process.env.DAEMO_AGENT_API_KEY,
    });

    const result = await daemoClient.processQuery("What is 3 to the power of 4?", {
        llmConfig: {
            provider: process.env.LLM_PROVIDER!,
            apiKey: process.env.LLM_API_KEY,
            model: "gpt-4o"
        },
    });

    console.log("Result:");
    console.log(result);

    stopConnection(hostedConnection);
}

main();