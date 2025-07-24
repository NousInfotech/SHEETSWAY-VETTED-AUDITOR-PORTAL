"use client"; // This component now uses hooks, so it must be a client component

import { useStaggeredVisibility } from "@/hooks/use-staggered-visibility";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Download,
  FileText,
  GanttChartSquare,
  HardDriveDownload,
  Lightbulb,
  MapPin,
  MessageSquareQuote,
  Scale,
  Star,
  Timer,
  XCircle,
} from "lucide-react";


// --- Re-using the same interfaces and StarRating component from before ---

interface Document {
  category: string;
  provided: boolean;
  source: string;
  structureClarity: {
    rating: number;
    description: string;
  };
}

interface ReportData {
  client: { name: string; industry: string; natureOfBusiness: string; };
  engagement: { period: string; type: string; turnover: string; teamPreference: string; };
  documents: Document[];
  readinessScore: number;
  quickInsight: string;
  clientNotes: string;
  downloadPackage: { fileName: string; size: string; includes: string[]; };
  location: string;
  deadline: string;
  bidStrategyHint: string;
}

interface AuditReportProps {
  data: ReportData;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
    ))}
  </div>
);

// --- The NEW Animated Component ---

export const AnimatedAuditReport = ({ data }: AuditReportProps) => {
  // We have 7 main sections to reveal. The hook manages the timing.
  const TOTAL_SECTIONS = 7;
  const visibleSections = useStaggeredVisibility(TOTAL_SECTIONS, 300);

  // Helper function to apply animation classes
  const getSectionClasses = (sectionIndex: number) => {
    return `transition-all duration-500 ease-in-out ${
      visibleSections >= sectionIndex
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-4"
    }`;
  };

  const readinessPercentage = data.readinessScore * 10;

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <main className="max-w-4xl mx-auto space-y-6">
        {/* Section 1: Client & Engagement */}
        <div className={getSectionClasses(1)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" /> Client Overview</CardTitle></CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex items-start gap-3"><Building2 className="h-4 w-4 mt-1 text-gray-500" /><div><p className="font-semibold">{data.client.name}</p><p className="text-gray-600">{data.client.industry}</p></div></div>
                        <div className="flex items-start gap-3"><GanttChartSquare className="h-4 w-4 mt-1 text-gray-500" /><div><p className="font-semibold">Nature of Business</p><p className="text-gray-600">{data.client.natureOfBusiness}</p></div></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5" /> Engagement Scope</CardTitle></CardHeader>
                    <CardContent>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-3"><ChevronRight className="h-4 w-4 text-gray-400" /><strong>Period:</strong> {data.engagement.period}</li>
                            <li className="flex items-center gap-3"><ChevronRight className="h-4 w-4 text-gray-400" /><strong>Type:</strong> {data.engagement.type}</li>
                            <li className="flex items-center gap-3"><ChevronRight className="h-4 w-4 text-gray-400" /><strong>Size:</strong> Approx. {data.engagement.turnover} turnover</li>
                            <li className="flex items-center gap-3"><ChevronRight className="h-4 w-4 text-gray-400" /><strong>Preference:</strong> {data.engagement.teamPreference}</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* Section 2: Document Structure */}
        <div className={getSectionClasses(2)}>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Document Structure & Source</CardTitle></CardHeader>
            <CardContent>
                <Table>
                    <TableHeader><TableRow><TableHead>Category</TableHead><TableHead className="text-center">Provided</TableHead><TableHead>Source</TableHead><TableHead>Structure & Clarity</TableHead></TableRow></TableHeader>
                    <TableBody>{data.documents.map((doc) => (<TableRow key={doc.category}><TableCell className="font-medium">{doc.category}</TableCell><TableCell className="text-center">{doc.provided ? <CheckCircle2 className="h-5 w-5 text-green-600 inline" /> : <XCircle className="h-5 w-5 text-red-600 inline" />}</TableCell><TableCell><Badge variant="outline">{doc.source}</Badge></TableCell><TableCell><div className="flex items-center gap-2"><StarRating rating={doc.structureClarity.rating} /><span className="text-xs text-gray-500">- {doc.structureClarity.description}</span></div></TableCell></TableRow>))}</TableBody>
                </Table>
            </CardContent>
          </Card>
        </div>

        {/* Section 3: Readiness Score */}
        <div className={getSectionClasses(3)}>
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Scale className="h-5 w-5" /> Overall Readiness Score</CardTitle><CardDescription>An AI-assessed score based on document completeness, clarity, and integration.</CardDescription></CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-baseline gap-2"><p className="text-3xl font-bold">{data.readinessScore.toFixed(1)} / 10</p><p className="text-lg font-semibold text-green-700">Sufficiently Prepared</p></div>
                    <Progress value={readinessPercentage} className="w-full" />
                </CardContent>
            </Card>
        </div>
        
        {/* Section 4: Insight & Notes */}
        <div className={getSectionClasses(4)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card><CardHeader><CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5" /> Quick Insight</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-700">{data.quickInsight}</p></CardContent></Card>
                <Card><CardHeader><CardTitle className="flex items-center gap-2"><MessageSquareQuote className="h-5 w-5" /> Client Notes</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-700 italic border-l-4 pl-4">"{data.clientNotes}"</p></CardContent></Card>
            </div>
        </div>

        {/* Section 5: Download & Logistics */}
        <div className={getSectionClasses(5)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1"><CardHeader><CardTitle className="flex items-center gap-2"><HardDriveDownload className="h-5 w-5" /> Download Package</CardTitle></CardHeader><CardContent className="flex flex-col items-center justify-center text-center space-y-3"><p className="text-sm text-gray-500">Includes: {data.downloadPackage.includes.join(', ')}</p><Button className="w-full"><Download className="mr-2 h-4 w-4" />Download Files ({data.downloadPackage.size})</Button></CardContent></Card>
                <Card className="md:col-span-2"><CardHeader><CardTitle>Logistics</CardTitle></CardHeader><CardContent className="space-y-4 text-sm"><div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-gray-500" /><strong>Location:</strong> {data.location}</div><div className="flex items-center gap-3"><Timer className="h-4 w-4 text-gray-500" /><strong>Deadline Preference:</strong> {data.deadline}</div></CardContent></Card>
            </div>
        </div>

        {/* Section 6: Bid Strategy Hint */}
        <div className={getSectionClasses(6)}>
            <Card className="bg-blue-50 border-blue-200">
                <CardHeader><CardTitle className="flex items-center gap-2 text-blue-800"><Lightbulb className="h-5 w-5 text-blue-600" /> Bid Strategy Hint</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-blue-700">{data.bidStrategyHint}</p></CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
};