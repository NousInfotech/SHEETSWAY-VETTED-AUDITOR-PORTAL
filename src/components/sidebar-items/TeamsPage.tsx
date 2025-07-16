"use client";

import { useState } from "react";
import { AuditorCard } from "./AuditorCard"; // Assuming this is in the same directory
import { dummyAuditors } from "./dummy-data"; // Assuming this is in the same directory
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuditorRegistrationForm } from "@/components/auth-register/AuditorRegistrationForm";
import { PlusCircle } from "lucide-react";

export default function TeamsPage() {
  // State to manage the dialog's visibility
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);

  return (
    <>
      <div className="bg-muted/40 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          
          {/* Updated Header Section */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-12">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Meet Our Team
              </h1>
              <p className="max-w-2xl mt-3 text-lg text-muted-foreground">
                A dedicated team of world-class security professionals.
              </p>
            </div>
            <div className="flex-shrink-0 text-center md:text-right">
              {/* Button to open the dialog */}
              <Button onClick={() => setIsAddMemberDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* You'll need to update AuditorCard to accept onViewProfile/onEditProfile props */}
            {dummyAuditors.map((auditor) => (
              <AuditorCard 
                key={auditor.id} 
                auditor={auditor}
                onViewProfile={() => { /* Implement view logic */ }}
                onEditProfile={() => { /* Implement edit logic */ }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Add a New Auditor</DialogTitle>
            <DialogDescription>
              Register a new auditor to join the firm. Their account will be created and they will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[80vh] overflow-y-auto pr-4">
            <AuditorRegistrationForm 
              // Pass the callback to close the dialog on successful submission
              onFormSubmit={() => setIsAddMemberDialogOpen(false)} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}