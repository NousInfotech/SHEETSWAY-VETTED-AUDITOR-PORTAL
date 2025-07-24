'use client';

import { useState, useEffect } from 'react';
import { ReportData, FlowingAuditReport } from '@/components/ai-mock/flowing-audit-report';
import { Loader2, BrainCircuit, ScanSearch } from 'lucide-react';

// Define the phases of the generation process
type ReportPhase = 'LOADING' | 'ANALYZING' | 'RENDERING';

// Define props, it just needs the final report data
interface AiReportGeneratorProps {
  reportData: ReportData;
}

// --- Helper component for the pre-rendering phases ---
const AnimationPhase = ({
    Icon, 
    messages, 
    title 
}: { Icon: React.ElementType, messages: string[], title: string }) => {
    const [currentMessage, setCurrentMessage] = useState(messages[0]);

    useEffect(() => {
        // Cycle through the messages every 1.5 seconds
        const messageInterval = setInterval(() => {
            setCurrentMessage(prev => {
                const currentIndex = messages.indexOf(prev);
                const nextIndex = (currentIndex + 1) % messages.length;
                return messages[nextIndex];
            });
        }, 1500);

        return () => clearInterval(messageInterval);
    }, [messages]);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Icon className="h-16 w-16 text-primary mb-6 animate-pulse" />
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground transition-opacity duration-300">{currentMessage}</p>
        </div>
    );
};


// --- The Main Orchestrator Component ---
export function AiReportGenerator({ reportData }: AiReportGeneratorProps) {
  const [phase, setPhase] = useState<ReportPhase>('LOADING');

  useEffect(() => {
    // This effect controls the transitions between phases
    const loadingTimer = setTimeout(() => {
      setPhase('ANALYZING');
    }, 3000); // <-- Loading phase duration: 3 seconds

    const analyzingTimer = setTimeout(() => {
        setPhase('RENDERING');
    }, 6000); // <-- Analyzing phase starts after 3s, lasts 3s (total 6s)

    // Cleanup timers if the component unmounts
    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(analyzingTimer);
    };
  }, []); // Run only once on mount

  // Render the correct UI based on the current phase
  switch (phase) {
    case 'LOADING':
      return (
        <AnimationPhase 
            Icon={Loader2}
            title="Initializing..."
            messages={[
                "Booting AI core...",
                "Connecting to knowledge base...",
                "Loading analysis models...",
            ]}
        />
      );

    case 'ANALYZING':
      return (
        <AnimationPhase 
            Icon={BrainCircuit}
            title="Analyzing Request..."
            messages={[
                "Parsing client requirements...",
                "Cross-referencing compliance frameworks...",
                "Identifying potential risks...",
                "Formulating bid strategy...",
            ]}
        />
      );

    case 'RENDERING':
      // Once we are in the rendering phase, show the report
      return <FlowingAuditReport data={reportData} />;
      
    default:
      return null;
  }
}