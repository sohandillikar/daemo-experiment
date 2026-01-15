import { DaemoBuilder, DaemoHostedConnection, SessionData } from 'daemo-engine';
import { CalculatorService } from './calculator';

export function initializeDaemo(systemPrompt: string) {
    const sessionData = new DaemoBuilder()
        .withServiceName("calculator")
        .withSystemPrompt(systemPrompt)
        .registerService(new CalculatorService())
        .build();
    sessionData.Port = 50052;
    console.log("Session data initialized!");
    return sessionData;
}

export async function startConnection(sessionData: SessionData) {
    const hostedConnection = new DaemoHostedConnection({
        daemoGatewayUrl: process.env.DAEMO_GATEWAY_URL,
        agentApiKey: process.env.DAEMO_AGENT_API_KEY,
    }, sessionData);
    await hostedConnection.start();
    console.log("Connection started!");
    return hostedConnection;
}

export function stopConnection(hostedConnection: DaemoHostedConnection) {
    hostedConnection.stop();
    console.log("Connection stopped...");
}