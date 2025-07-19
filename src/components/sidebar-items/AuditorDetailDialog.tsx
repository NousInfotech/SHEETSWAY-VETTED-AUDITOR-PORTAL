import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AuditorProfile } from "@/stores/useProfileStore";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface AuditorDetailDialogProps {
  auditor: AuditorProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AuditorDetailDialog({ auditor, isOpen, onClose }: AuditorDetailDialogProps) {
  if (!auditor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{auditor.name}</DialogTitle>
          <DialogDescription>
            Role: {auditor.role} • Member since {format(new Date(auditor.createdAt), 'MMMM yyyy')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-muted-foreground">Status</span>
            <div className="col-span-2">
                <Badge variant={auditor.accountStatus === 'VERIFIED' ? 'default' : 'secondary'}>{auditor.accountStatus}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-muted-foreground">License Number</span>
            <span className="col-span-2 font-mono">{auditor.licenseNumber}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-muted-foreground">Experience</span>
            <span className="col-span-2">{auditor.yearsExperience} years</span>
          </div>
          <div className="grid grid-cols-3 items-start gap-4">
            <span className="text-muted-foreground pt-1">Specialties</span>
            <div className="col-span-2 flex flex-wrap gap-2">
              {auditor.specialties.map(s => <Badge key={s} variant="outline">{s}</Badge>)}
            </div>
          </div>
          <div className="grid grid-cols-3 items-start gap-4">
            <span className="text-muted-foreground pt-1">Languages</span>
            <div className="col-span-2 flex flex-wrap gap-2">
              {auditor.languages.map(l => <Badge key={l}>{l}</Badge>)}
            </div>
          </div>
           <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-muted-foreground">Payout Currency</span>
            <span className="col-span-2">{auditor.payoutCurrency || 'Not Set'}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}