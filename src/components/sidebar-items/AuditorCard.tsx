import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Pencil,
  Languages as LanguagesIcon,
  BadgeCheckIcon
} from "lucide-react";
import { AuditorProfile } from "@/stores/useProfileStore";
import { cn } from "@/lib/utils";

// A robust helper function to get initials from a name
const getInitials = (name: string | null | undefined): string => {
  if (!name) return "??";
  const names = name.trim().split(" ");
  if (names.length === 1 && names[0] !== '') return names[0].substring(0, 2).toUpperCase();
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return "??";
};

interface AuditorCardProps {
  auditor: AuditorProfile;
  onViewProfile: (auditor: AuditorProfile) => void;
  onEditProfile: (auditor: AuditorProfile) => void;
}

export function AuditorCard({ auditor, onViewProfile, onEditProfile }: AuditorCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out border group hover:shadow-xl hover:-translate-y-1.5">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        
        <div className="relative flex-shrink-0">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 opacity-75 blur-sm group-hover:opacity-100 transition duration-300"></div>
            <Avatar className="relative w-16 h-16 border-2 border-background">
                <AvatarImage src="" />
                <AvatarFallback className="text-lg font-bold text-white bg-gradient-to-br from-gray-700 to-gray-900">
                  {getInitials(auditor.name)}
                </AvatarFallback>
            </Avatar>
        </div>

        <div className="flex-1">
          <CardTitle className="text-xl">{auditor.name}</CardTitle>
          <CardDescription>
            {auditor.role} • {auditor.yearsExperience} years experience
          </CardDescription>
          <div className="flex items-center flex-wrap gap-2 pt-2 text-sm">
             <Badge
               className={cn(
                 "border-transparent",
                 auditor.accountStatus === 'VERIFIED' && "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
                 auditor.accountStatus === 'PENDING' && "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
                 auditor.accountStatus === 'BANNED' && "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
               )}
             >
                {auditor.accountStatus}
             </Badge>
             {/* --- NEW: VETTED STATUS BADGE --- */}
             {auditor.vettedStatus === 'APPROVED' && (
                <Badge variant="outline" className="border-sky-500 text-sky-600 dark:text-sky-400">
                    <BadgeCheckIcon className="h-3.5 w-3.5 mr-1.5" />
                    
                    Vetted
                </Badge>
             )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow space-y-4">
        {/* --- NEW: PERFORMANCE METRICS --- */}
        <div className="flex justify-around p-3 rounded-lg bg-muted/50">
            <div className="text-center">
                <p className="font-bold text-lg">{auditor.rating.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Rating</p>
            </div>
             <div className="text-center">
                <p className="font-bold text-lg">{auditor.reviewsCount}</p>
                <p className="text-xs text-muted-foreground">Reviews</p>
            </div>
             <div className="text-center">
                <p className="font-bold text-lg">{auditor.successCount}</p>
                <p className="text-xs text-muted-foreground">Audits Done</p>
            </div>
        </div>

        <div>
            <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Core Specialties</h4>
            <div className="flex flex-wrap gap-2">
                {auditor.specialties?.length > 0 ? (
                    auditor.specialties.slice(0, 4).map((specialty) => (
                    <Badge key={specialty} variant="secondary">{specialty}</Badge>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground/80">No specialties listed.</p>
                )}
                {auditor.specialties?.length > 4 && (
                    <Badge variant="outline">+{auditor.specialties.length - 4} more</Badge>
                )}
            </div>
        </div>

        {/* --- NEW: LANGUAGES SECTION --- */}
        <div>
            <h4 className="mb-2 text-sm font-semibold text-muted-foreground flex items-center">
                <LanguagesIcon className="h-4 w-4 mr-2" />
                Languages
            </h4>
            <div className="flex flex-wrap gap-2">
                {auditor.languages?.length > 0 ? (
                    auditor.languages.map((lang) => (
                        <span key={lang} className="text-sm text-foreground">{lang}</span>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground/80">Not specified.</p>
                )}
            </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-4 border-t">
        <Button className="w-full" onClick={() => onViewProfile(auditor)}>
          <ShieldCheck className="w-4 h-4 mr-2" />
          View Profile
        </Button>
        {/* <Button variant="outline" size="icon" onClick={() => onEditProfile(auditor)}>
          <Pencil className="w-4 h-4" />
          <span className="sr-only">Edit Profile</span>
        </Button> */}
      </CardFooter>
    </Card>
  );
}