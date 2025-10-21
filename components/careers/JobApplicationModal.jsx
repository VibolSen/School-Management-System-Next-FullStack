"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function JobApplicationModal({ isOpen, onClose, jobPostingId, jobTitle }) {
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!applicantName || !applicantEmail || !resumeFile) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, Email, Resume).",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("applicantName", applicantName);
    formData.append("applicantEmail", applicantEmail);
    formData.append("jobPostingId", jobPostingId);
    if (resumeFile) {
      formData.append("resume", resumeFile);
    }
    if (coverLetterFile) {
      formData.append("coverLetter", coverLetterFile);
    }

    try {
      const res = await fetch("/api/careers/applications", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit application.");
      }

      toast({
        title: "Application Submitted",
        description: "Your job application has been successfully submitted!",
        variant: "success",
      });
      onClose(); // Close modal on success
      // Optionally clear form fields
      setApplicantName("");
      setApplicantEmail("");
      setResumeFile(null);
      setCoverLetterFile(null);
    } catch (error) {
      console.error("Application submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
          <DialogDescription>
            Fill in your details and upload your documents to apply for this position.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={applicantEmail}
              onChange={(e) => setApplicantEmail(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="resume" className="text-right">
              Resume (PDF)
            </Label>
            <Input
              id="resume"
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, setResumeFile)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="coverLetter" className="text-right">
              Cover Letter (Optional, PDF)
            </Label>
            <Input
              id="coverLetter"
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, setCoverLetterFile)}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
