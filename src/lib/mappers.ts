import { ClientRequest } from './services/clientRequestService';
import { ReportData } from '@/components/ai-mock/flowing-audit-report'; // Adjust path if needed

/**
 * "Mimics" an AI by analyzing a ClientRequest and generating a detailed ReportData object.
 * This is where you can add logic to make the report seem intelligent.
 */
export function mapClientRequestToReportData(request: ClientRequest): ReportData {
  
  // --- AI-Powered Document Inference ---
  // Infer required documents based on the request type and framework
  let documents = [
    { category: "Trial Balance", provided: true, source: "Awaiting Upload", structureClarity: { rating: 3, description: "Unknown" } },
    { category: "General Ledger", provided: true, source: "Awaiting Upload", structureClarity: { rating: 2, description: "Unknown" } },
    { category: "Bank Statements", provided: true, source: "Awaiting Upload", structureClarity: { rating: 3, description: "Unknown" } },
  ];
  if (request.type === 'AUDIT') {
    documents.push({ category: "Financial Statements (PY)", provided: false, source: "Missing", structureClarity: { rating: 0, description: "Not Provided" } });
  }
  if (request.framework.includes('SOC')) {
    documents.push({ category: "System Description", provided: false, source: "Missing", structureClarity: { rating: 0, description: "Critical" } });
  }
  
  // --- AI-Powered Insight Generation ---
  let readinessScore = 7.5;
  let quickInsight = `The request for a ${request.type} audit on the ${request.framework} framework appears standard.`;
  let bidStrategyHint = `Budget is set at ${request.budget}. Focus on aligning your proposal with the client's preferred timezone (${request.timeZone}).`;

  if (request.urgency === 'URGENT') {
    readinessScore -= 1.5;
    quickInsight += " The urgent nature may indicate poor prior planning or an unforeseen need.";
    bidStrategyHint += " An expedited timeline could justify a higher bid."
  }
  if (!request.notes || request.notes.length < 50) {
    readinessScore -= 1;
    quickInsight += " The project details are sparse, indicating a need for a thorough discovery call.";
  }


  const reportData: ReportData = {
    client: {
      name: request.title, // Using the title as the client name placeholder
      industry: request.type, // Using the type as industry
      natureOfBusiness: request.notes || 'No detailed business description was provided by the client.',
    },
    engagement: {
      period: new Date(request.financialYear).getFullYear().toString(),
      type: `${request.type} (${request.framework})`,
      turnover: `Budgeted at ${request.budget?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,
      teamPreference: 'Not specified by client.',
    },
    documents: documents,
    readinessScore: Math.max(2.0, readinessScore), // Ensure score doesn't go too low
    quickInsight: quickInsight,
    clientNotes: "This report is an AI-generated analysis based on the initial client request.",
    deadline: new Date(request.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    bidStrategyHint: bidStrategyHint,
  };

  return reportData;
}