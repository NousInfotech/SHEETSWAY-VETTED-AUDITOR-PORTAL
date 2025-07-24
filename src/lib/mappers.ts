// src/lib/mappers.ts

import { ClientRequest } from './services/clientRequestService';
import { ReportData } from '@/components/ai-mock/flowing-audit-report';
import { formatCurrency, formatDate } from '@/lib/utils'; // Adjust path if needed

/**
 * "Mimics" an AI by analyzing a ClientRequest and generating a rich, detailed ReportData object.
 */
export function mapClientRequestToReportData(request: ClientRequest): ReportData {
  
  // --- Detailed Analysis Logic ---
  let readinessScore = 8.0;
  let insights: string[] = [];
  let risks: string[] = [];
  let strategyHints: string[] = [
      `The client's budget is ${formatCurrency(request.budget, 'USD')}. Ensure your proposal reflects the value provided within this range.`,
      `Communication is key. The client's preferred languages are ${request.preferredLanguages.join(', ')} and they operate in the ${request.timeZone} timezone.`
  ];

  // Analyze urgency
  if (request.urgency === 'URGENT') {
    readinessScore -= 2.0;
    risks.push("The 'URGENT' flag suggests a reactive need, potentially due to external pressure or poor planning. This may lead to a chaotic engagement.");
    strategyHints.push("An expedited timeline justifies a premium on the proposal. Clearly state the assumptions made to meet the deadline.");
  }

  // Analyze notes
  if (!request.notes || request.notes.length < 100) {
    readinessScore -= 1.5;
    risks.push("The project description is sparse. Critical details may be missing, requiring extensive discovery.");
  } else {
    insights.push("The client provided a detailed project description, which is a positive indicator of preparedness.");
  }
  
  // --- FIX APPLIED HERE ---
  // Provide a fallback of `new Date()` in case any of the request dates are null.
  // The `||` operator means "use the value on the left, but if it's null/undefined, use the value on the right".
  const start = new Date(request.auditStart || new Date());
  const end = new Date(request.auditEnd || new Date());
  const deadline = new Date(request.deadline || new Date());
  const financialYearDate = new Date(request.financialYear || new Date());
  // -------------------------

  const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (durationDays < 30 && durationDays >= 0) { // Check for non-negative duration
      readinessScore -= 1.0;
      risks.push(`The estimated duration of ${durationDays} days is tight for a standard ${request.type} engagement.`);
  }

  // Analyze special flags
  if (request.specialFlags.includes('first_audit')) {
      readinessScore -= 1.0;
      risks.push("This is a 'first_audit', which often uncovers foundational bookkeeping issues and can extend the project scope.");
      strategyHints.push("Position your firm as a helpful guide. Offer advisory services for setting up best practices post-audit.");
  }
  if (request.specialFlags.includes('public_company')) {
      readinessScore += 1.0; // They are likely more organized
      insights.push("As a 'public_company', the client should have well-documented internal controls, which may streamline the process.");
  }

  // Final readiness score
  const finalReadinessScore = Math.max(2.0, Math.min(9.9, readinessScore));

  // The FlowingAuditReport component expects a specific format, so we map our analysis to it.
  return {
    client: {
        name: request.title,
        industry: request.type,
        natureOfBusiness: request.notes || 'No detailed business description was provided.',
    },
    engagement: {
        period: financialYearDate.getFullYear().toString(),
        type: `${request.type} (${request.framework})`,
        turnover: formatCurrency(request.budget, 'USD'),
        teamPreference: 'Not Specified by Client',
    },
    documents: [ // Using the analysis to create document-like entries
        { category: "Client Profile & Scope", provided: true, source: "AI Inference", structureClarity: { rating: 5, description: "Analyzed" } },
        { category: "Key Dates & Timeline", provided: true, source: "AI Inference", structureClarity: { rating: 4, description: "Extracted" } },
        { category: "Identified Risk Factors", provided: risks.length > 0, source: "AI Inference", structureClarity: { rating: 5, description: risks.length > 0 ? "Risks Found" : "No Major Risks" } },
        { category: "Strategic Recommendations", provided: true, source: "AI Inference", structureClarity: { rating: 5, description: "Generated" } },
    ],
    readinessScore: finalReadinessScore,
    quickInsight: insights.join('. ') || "Standard engagement profile. Please review risk factors for details.",
    // We can use the clientNotes section to list the identified risks for clarity
    clientNotes: risks.length > 0 ? risks.join('; ') : "No major risks were identified from the provided information.",
    deadline: formatDate(deadline),
    bidStrategyHint: strategyHints.join(' '),
  };
}