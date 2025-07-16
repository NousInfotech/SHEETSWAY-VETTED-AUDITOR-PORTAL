import { AuditorRole } from "@/lib/validators/auditor-schema";

// We'll define a type for our display-ready auditor profile
export type AuditorProfile = {
  id: string;
  name: string;
  role: AuditorRole;
  yearsExperience: number;
  specialties: string[];
  languages: string[];
  rating: number;
  reviewsCount: number;
  avatarUrl: string;
  firmName?: string; // Optional firm name
};

export const dummyAuditors: AuditorProfile[] = [
  {
    id: "auditor-1",
    name: "Dr. Evelyn Reed",
    role: AuditorRole.PARTNER,
    yearsExperience: 15,
    specialties: ["DeFi Protocols", "L2 Scaling", "Tokenomics", "Security Audits"],
    languages: ["English", "German"],
    rating: 4.9,
    reviewsCount: 124,
    avatarUrl: "https://avatar.vercel.sh/evelyn.png",
    firmName: "Quantum Audits",
  },
  {
    id: "auditor-2",
    name: "Kenji Tanaka",
    role: AuditorRole.SENIOR,
    yearsExperience: 7,
    specialties: ["NFT Marketplaces", "GameFi", "Smart Contract Audit"],
    languages: ["English", "Japanese"],
    rating: 4.8,
    reviewsCount: 88,
    avatarUrl: "https://avatar.vercel.sh/kenji.png",
  },
  {
    id: "auditor-3",
    name: "Maria Garcia",
    role: AuditorRole.SENIOR,
    yearsExperience: 6,
    specialties: ["Smart Contract Audit", "Solidity", "Governance"],
    languages: ["English", "Spanish"],
    rating: 4.7,
    reviewsCount: 72,
    avatarUrl: "https://avatar.vercel.sh/maria.png",
    firmName: "Quantum Audits",
  },
  {
    id: "auditor-4",
    name: "Ben Carter",
    role: AuditorRole.JUNIOR,
    yearsExperience: 2,
    specialties: ["Smart Contract Audit", "Frontend Integration"],
    languages: ["English"],
    rating: 4.5,
    reviewsCount: 31,
    avatarUrl: "https://avatar.vercel.sh/ben.png",
  },
  {
    id: "auditor-5",
    name: "Fatima Al-Jamil",
    role: AuditorRole.SENIOR,
    yearsExperience: 9,
    specialties: ["Cross-Chain Bridges", "Zero-Knowledge Proofs", "Security Audits"],
    languages: ["English", "Arabic", "French"],
    rating: 4.9,
    reviewsCount: 95,
    avatarUrl: "https://avatar.vercel.sh/fatima.png",
    firmName: "Cypher Security",
  },
  {
    id: "auditor-6",
    name: "Leo Chen",
    role: AuditorRole.JUNIOR,
    yearsExperience: 3,
    specialties: ["DAO Tooling", "Yield Farming", "Smart Contract Audit"],
    languages: ["English", "Mandarin"],
    rating: 4.6,
    reviewsCount: 45,
    avatarUrl: "https://avatar.vercel.sh/leo.png",
  },
];