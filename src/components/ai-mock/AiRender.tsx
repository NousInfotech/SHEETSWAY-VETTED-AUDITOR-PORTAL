import { FlowingAuditReport } from "@/components/ai-mock/flowing-audit-report";
import PageContainer from "@/components/layout/page-container";

// The data object remains the same. It is the "input" for our AI mimic.
const reportDataForClientA = {
  client: {
    name: "Anonymous – Small Business",
    industry: "Retail (Clothing & Accessories)",
    natureOfBusiness:
      "Operates both physical stores and an online shop. Sells mid-range fashion products, with seasonal sales peaks. Handles bulk inventory and international suppliers.",
  },
  engagement: {
    period: "FY 2024",
    type: "Statutory Financial Audit",
    turnover: "€3.5M",
    teamPreference: "Solo auditor or small firm",
  },
  documents: [
    { category: "Trial Balance", provided: true, source: "Synced via Xero", structureClarity: { rating: 5, description: "Well-structured" } },
    { category: "General Ledger", provided: true, source: "Uploaded (Excel)", structureClarity: { rating: 2, description: "Needs cleanup" } },
    { category: "Financial Statements (PY)", provided: true, source: "Manual Upload (.pdf)", structureClarity: { rating: 1, description: "Scanned PDF" } },
    { category: "Inventory Summary", provided: true, source: "Manual Upload (.csv)", structureClarity: { rating: 4, description: "Clear by category" } },
    { category: "Payroll Report", provided: false, source: "—", structureClarity: { rating: 0, description: "—" } },
    { category: "Lease Agreements", provided: true, source: "Manual Upload (ZIP)", structureClarity: { rating: 2, description: "Multiple formats" } },
    { category: "Bank Statements", provided: true, source: "API Integration (Revolut)", structureClarity: { rating: 5, description: "Real-time feed" } },
  ],
  readinessScore: 7.8,
  quickInsight: "Core financials are integrated or neatly uploaded. Some auxiliary documents (payroll, leases) are inconsistent or missing. Moderate prep time required.",
  clientNotes: "We've connected Xero and our main bank account. Inventory was exported from Shopify. We can upload payroll if needed — currently handled by a third-party provider.",
  deadline: "Audit completed by Nov 30, 2025",
  bidStrategyHint: "Strong base provided. Some document wrangling may be needed — great opportunity for tech-savvy or lean audit teams.",
};

// Render the page using the new flowing component
export default function AiRenderPage() {
  return (
    <PageContainer>
        <div className="container mx-auto">
            <FlowingAuditReport data={reportDataForClientA} />
        </div>
    </PageContainer>
  )
}







// ########################################################################################################################





// /app/report/page.tsx

// import { FlowingAuditReport } from "@/components/ai-mock/flowing-audit-report";
// import PageContainer from "@/components/layout/page-container";

// // =========================================================================
// // == PARAMETER SET #1: A Well-Prepared Client =============================
// // =========================================================================
// const reportDataForClientA = {
//   // --- Change Client Details Here ---
//   client: {
//     name: "Innovatech Solutions Ltd.",
//     industry: "SaaS (Software as a Service)",
//     natureOfBusiness:
//       "Provides cloud-based project management tools for enterprise clients. Focuses on recurring subscription revenue.",
//   },
//   // --- Change Engagement Details Here ---
//   engagement: {
//     period: "FY 2025",
//     type: "Statutory Financial Audit",
//     turnover: "€5.2M",
//     teamPreference: "Small audit firm",
//   },
//   // --- Change Document Status & Ratings Here ---
//   documents: [
//     { category: "Trial Balance", provided: true, source: "Synced via Xero", structureClarity: { rating: 5, description: "Well-structured" } },
//     { category: "General Ledger", provided: true, source: "API (QuickBooks)", structureClarity: { rating: 4, description: "Minor cleanup" } },
//     { category: "Financial Statements (PY)", provided: true, source: "Audited FS (.pdf)", structureClarity: { rating: 4, description: "Clear PDF" } },
//     { category: "Revenue Recognition", provided: true, source: "Uploaded (.xlsx)", structureClarity: { rating: 5, description: "Excellent detail" } },
//     { category: "Payroll Report", provided: true, source: "Third-party (Rippling)", structureClarity: { rating: 5, description: "API Feed" } },
//     { category: "Bank Statements", provided: true, source: "API Integration (Stripe)", structureClarity: { rating: 5, description: "Real-time feed" } },
//   ],
//   // --- Change AI-Generated Insights Here ---
//   readinessScore: 9.2,
//   quickInsight:
//     "Client is highly prepared. Core financial systems are fully integrated via API, and all primary documentation is clean and readily available.",
//   clientNotes:
//     "All our main accounts are linked. The revenue recognition schedule is our own custom export, let us know if you have questions.",
//   deadline: "Audit completed by Oct 31, 2025",
//   bidStrategyHint:
//     "This is a straightforward engagement. A great opportunity for a tech-savvy team to perform an efficient, lean audit. Focus on speed and accuracy.",
// };


// // =========================================================================
// // == PARAMETER SET #2: A Client That Needs More Prep ======================
// // =========================================================================
// const reportDataForClientB = {
//   // --- Different Client Details ---
//   client: {
//     name: "Artisan Goods & Co.",
//     industry: "Retail (Handmade Crafts)",
//     natureOfBusiness:
//       "Operates a single physical store and an Etsy shop. Manages physical inventory and deals with many small, local suppliers.",
//   },
//   // --- Different Engagement Details ---
//   engagement: {
//     period: "FY 2024",
//     type: "Financial Review & Compilation",
//     turnover: "€850K",
//     teamPreference: "Solo auditor or bookkeeper",
//   },
//   // --- Different Document Status ---
//   documents: [
//     { category: "Trial Balance", provided: true, source: "Uploaded (Excel)", structureClarity: { rating: 3, description: "Needs formatting" } },
//     { category: "General Ledger", provided: true, source: "Uploaded (Excel)", structureClarity: { rating: 2, description: "Needs cleanup" } },
//     { category: "Financial Statements (PY)", provided: false, source: "—", structureClarity: { rating: 0, description: "Missing" } },
//     { category: "Inventory Count Sheets", provided: true, source: "Scanned (.pdf)", structureClarity: { rating: 1, description: "Handwritten" } },
//     { category: "Payroll Report", provided: false, source: "—", structureClarity: { rating: 0, description: "Missing" } },
//     { category: "Bank Statements", provided: true, source: "Manual Upload (.pdf)", structureClarity: { rating: 2, description: "Scanned Statements" } },
//   ],
//   // --- Different AI Insights ---
//   readinessScore: 4.5,
//   quickInsight:
//     "Significant preparation required. Core records are manual Excel uploads and key documents like payroll and prior year financials are missing.",
//   clientNotes:
//     "We do our books ourselves in Excel. We can try to find the payroll stubs if you need them. Not sure where last year's statements are.",
//   deadline: "Best effort by Dec 15, 2025",
//   bidStrategyHint:
//     "High-effort engagement. Requires significant document wrangling and data cleanup. Opportunity for advisory services (bookkeeping, system setup). Bid should account for high prep time.",
// };


// // The Page Component
// export default function ReportPage() {
//   // To render a different report, simply change which data object you pass to the component.
//   // This is where the content becomes dynamic.
  
//   // Use this line for the well-prepared client:
//   return (
//     <PageContainer>
//         <div className="container mx-auto">
//             <FlowingAuditReport data={reportDataForClientA} />
//         </div>
//     </PageContainer>
//   )

//   // Or uncomment this line for the client that needs help:
//   // return <FlowingAuditReport data={reportDataForClientB} />;
// }