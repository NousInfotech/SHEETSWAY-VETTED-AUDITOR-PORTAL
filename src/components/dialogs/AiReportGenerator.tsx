'use client';

import { useState, useEffect } from 'react';
import {
  ReportData,
  FlowingAuditReport
} from '@/components/ai-mock/flowing-audit-report';
import { Loader2, BrainCircuit } from 'lucide-react';

type ReportPhase = 'LOADING' | 'ANALYZING' | 'RENDERING';

interface AiReportGeneratorProps {
  reportData: ReportData;

  onPhaseChange: (phase: ReportPhase) => void;
}

const AnimationPhase = ({
  Icon,
  messages,
  title,
  animationClass = 'animate-pulse'
}: {
  Icon: React.ElementType;
  messages: string[];
  title: string;
  animationClass?: string;
}) => {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => {
        const currentIndex = messages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 1500);

    return () => clearInterval(messageInterval);
  }, [messages]);

  return (
    <div className='p-8'>
      <Icon
        className={`text-primary mx-auto mb-6 h-16 w-16 ${animationClass}`}
      />
      <h2 className='mb-2 text-center text-2xl font-bold'>{title}</h2>
      <p className='text-muted-foreground text-center transition-opacity duration-300'>
        {currentMessage}
      </p>
    </div>
  );
};

export function AiReportGenerator({
  reportData,
  onPhaseChange
}: AiReportGeneratorProps) {
  const [phase, setPhase] = useState<ReportPhase>('LOADING');

  useEffect(() => {
    onPhaseChange(phase);

    const loadingTimer = setTimeout(() => {
      setPhase('ANALYZING');
      onPhaseChange('ANALYZING');
    }, 3000);

    const analyzingTimer = setTimeout(() => {
      setPhase('RENDERING');
      onPhaseChange('RENDERING');
    }, 6000);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(analyzingTimer);
    };
  }, [onPhaseChange]);

  switch (phase) {
    case 'LOADING':
      return (
        <AnimationPhase
          Icon={Loader2}
          title='Initializing...'
          messages={[
            'Booting AI core...',
            'Connecting to knowledge base...',
            'Loading analysis models...'
          ]}
          animationClass='animate-spin'
        />
      );
    case 'ANALYZING':
      return (
        <AnimationPhase
          Icon={BrainCircuit}
          title='Analyzing Request...'
          messages={[
            'Parsing client requirements...',
            'Cross-referencing compliance frameworks...',
            'Identifying potential risks...'
          ]}
        />
      );
    case 'RENDERING':
      return <FlowingAuditReport data={reportData} />;
    default:
      return null;
  }
}
