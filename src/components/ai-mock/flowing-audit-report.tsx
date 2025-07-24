"use client";

import { useMemo, useRef, useEffect } from 'react';
import { useStaggeredVisibility } from "@/hooks/use-staggered-visibility";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Star, XCircle } from "lucide-react";

// --- TYPE DEFINITIONS ---
interface Document {
  category: string;
  provided: boolean;
  source: string;
  structureClarity: {
    rating: number;
    description: string;
  };
}

export interface ReportData {
  client: {
    name: string;
    industry: string;
    natureOfBusiness: string;
  };
  engagement: {
    period: string;
    type: string;
    turnover: string;
    teamPreference: string;
  };
  documents: Document[];
  readinessScore: number;
  quickInsight: string;
  clientNotes: string;
  deadline: string;
  bidStrategyHint: string;
}

interface FlowingAuditReportProps {
    data: ReportData;
}


// --- HELPER COMPONENTS ---

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
        }`}
      />
    ))}
  </div>
);

// A special component to animate table rows internally
const AnimatedDocumentTable = ({ documents }: { documents: Document[] }) => {
  const visibleRows = useStaggeredVisibility(documents.length, 100);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[25%]">Category</TableHead>
          <TableHead className="w-[15%] text-center">Provided</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Structure & Clarity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.slice(0, visibleRows).map((doc) => (
          <TableRow key={doc.category} className="transition-opacity duration-300 ease-in-out opacity-100">
            <TableCell className="font-medium">{doc.category}</TableCell>
            <TableCell className="text-center">
              {doc.provided ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 inline" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 inline" />
              )}
            </TableCell>
            <TableCell>
              <Badge variant="outline">{doc.source}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <StarRating rating={doc.structureClarity.rating} />
                <span className="text-xs text-gray-500">- {doc.structureClarity.description}</span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};


// --- MAIN FLOWING REPORT COMPONENT ---

export const FlowingAuditReport = ({ data }: FlowingAuditReportProps) => {
  // Flatten the data into a renderable array of "lines"
  const reportLines = useMemo(() => [
    { type: 'heading', content: 'Client Overview' },
    { type: 'keyValue', content: { key: 'Client', value: data.client.name } },
    { type: 'keyValue', content: { key: 'Industry', value: data.client.industry } },
    { type: 'paragraph', content: data.client.natureOfBusiness },
    { type: 'divider' },
    { type: 'heading', content: 'Engagement Scope' },
    { type: 'keyValue', content: { key: 'Period', value: data.engagement.period } },
    { type: 'keyValue', content: { key: 'Type', value: data.engagement.type } },
    { type: 'keyValue', content: { key: 'Size', value: `Approx. ${data.engagement.turnover} turnover` } },
    { type: 'keyValue', content: { key: 'Team Preference', value: data.engagement.teamPreference } },
    { type: 'divider' },
    { type: 'heading', content: 'Document Analysis' },
    { type: 'documentTable', content: data.documents },
    { type: 'divider' },
    { type: 'heading', content: 'Overall Readiness' },
    { type: 'readinessScore', content: { score: data.readinessScore } },
    { type: 'paragraph', content: data.quickInsight },
    { type: 'divider' },
    { type: 'heading', content: 'Additional Context' },
    { type: 'quote', content: data.clientNotes },
    { type: 'keyValue', content: { key: 'Deadline Preference', value: data.deadline } },
    { type: 'divider' },
    { type: 'hint', content: data.bidStrategyHint },
  ], [data]);

  // Use the hook to determine how many lines are visible
  const visibleLineCount = useStaggeredVisibility(reportLines.length, 120);

  // Create a ref for the marker div that we will scroll to
  const endOfContentRef = useRef<HTMLDivElement>(null);

  // Use useEffect to scroll to the marker div whenever a new line appears
  useEffect(() => {
    // A short timeout ensures the DOM has updated before we try to scroll
    setTimeout(() => {
        endOfContentRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  }, [visibleLineCount]);


  return (
    <div className="bg-white min-h-screen font-sans p-4 sm:p-8 lg:p-12">
      <main className="max-w-3xl mx-auto text-gray-800">
        <h1 className="text-3xl font-bold mb-2">Audit Readiness Report</h1>
        <p className="text-sm text-gray-500 mb-8">AI-Generated Analysis · Status: Complete</p>
        
        <div className="space-y-4">
          {/* Render only the visible lines */}
          {reportLines.slice(0, visibleLineCount).map((line, index) => {
            const animationClass = "transition-all duration-300 ease-in-out opacity-100 translate-y-0";
            
            // Use a switch to render the correct JSX for each line type
            return (
              <div key={index} className={`opacity-0 translate-y-3 ${animationClass}`}>
                {(() => {
                  switch (line.type) {
                    case 'heading':
                      return <h2 className="text-xl font-semibold text-gray-900 pt-4 pb-1 border-b">{line.content as string}</h2>;
                    
                    case 'keyValue':
                      const kv = line.content as { key: string; value: string };
                      return <p><strong className="font-medium">{kv.key}:</strong> {kv.value}</p>;
                    
                    case 'paragraph':
                      return <p className="leading-relaxed">{line.content as string}</p>;
                    
                    case 'quote':
                      return <p className="pl-4 italic border-l-4 border-gray-300 text-gray-600">"{line.content as string}"</p>;
                    
                    case 'hint':
                        return <div className="p-3 bg-blue-50 border border-blue-200 rounded-md"><p className="font-semibold text-blue-800">💡 Bid Strategy: <span className="font-normal">{line.content as string}</span></p></div>;
                    
                    case 'divider':
                      return <div className="h-px bg-gray-200 my-4"></div>;
                    
                    case 'documentTable':
                      return <AnimatedDocumentTable documents={line.content as Document[]} />;
                    
                    case 'readinessScore':
                      const rs = line.content as { score: number };
                      return (
                          <div>
                            <p className="font-medium">Readiness Score: <span className="text-2xl font-bold text-green-700">{rs.score.toFixed(1)}/10</span></p>
                            <Progress value={rs.score * 10} className="mt-2" />
                          </div>
                      );
                      
                    default:
                      return null;
                  }
                })()}
              </div>
            );
          })}
        </div>
        
        {/* This invisible div is the marker that we scroll to */}
        <div ref={endOfContentRef} />
      </main>
    </div>
  );
};