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
import { Star, ShieldCheck } from "lucide-react";
import type { AuditorProfile } from "./dummy-data";

// A small helper function to get initials from a name
const getInitials = (name: string) => {
  const names = name.split(" ");
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

interface AuditorCardProps {
  auditor: AuditorProfile;
  onViewProfile: (auditor: AuditorProfile) => void;
  onEditProfile: (auditor: AuditorProfile) => void;
}

export function AuditorCard({ auditor, onViewProfile, onEditProfile }: AuditorCardProps) {
  return (
    <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <Avatar className="w-16 h-16 border">
          <AvatarImage src={auditor.avatarUrl} alt={auditor.name} />
          <AvatarFallback>{getInitials(auditor.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-xl">{auditor.name}</CardTitle>
          <CardDescription>
            {auditor.role} • {auditor.yearsExperience} years experience
          </CardDescription>
          <div className="flex items-center pt-2 text-sm text-muted-foreground">
            <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-500" />
            <span className="font-semibold">{auditor.rating}</span>
            <span className="mx-1">/</span>
            <span>{auditor.reviewsCount} reviews</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
          Core Specialties
        </h4>
        <div className="flex flex-wrap gap-2">
          {auditor.specialties.slice(0, 4).map((specialty) => (
            <Badge key={specialty} variant="secondary">
              {specialty}
            </Badge>
          ))}
          {auditor.specialties.length > 4 && (
            <Badge variant="outline">+{auditor.specialties.length - 4} more</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <ShieldCheck className="w-4 h-4 mr-2" />
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
}



