import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

const LeadPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
  });

  useEffect(() => {
    // Check if already shown in this session
    const hasSeenPopup = sessionStorage.getItem("vidyastara_lead_popup_seen");

    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("vidyastara_lead_popup_seen", "true");
      }, 8000); // 8 seconds delay

      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.contact || !form.email) {
      toast.error("Please fill all details!");
      return;
    }

    // Mock save to localStorage
    const existingLeads = JSON.parse(
      localStorage.getItem("vidyastara_leads") || "[]",
    );
    const newLead = { ...form, date: new Date().toISOString() };
    localStorage.setItem(
      "vidyastara_leads",
      JSON.stringify([...existingLeads, newLead]),
    );

    toast.success("Thank you! We will contact you soon.");
    setHasSubmitted(true);
    setTimeout(() => setIsOpen(false), 2000);
  };

  const handeClose = () => {
    setIsOpen(false);
  };

  if (hasSubmitted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md border-primary/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold text-center gradient-text-primary">
            Unlock Your Potential! 🚀
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Get expert counseling and a free study roadmap.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Ex: Rahul Sharma"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border-primary/20 focus-visible:ring-primary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">Contact Number</Label>
            <Input
              id="contact"
              type="tel"
              placeholder="Ex: 9876543210"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className="border-primary/20 focus-visible:ring-primary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Ex: rahul@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border-primary/20 focus-visible:ring-primary/50"
            />
          </div>

          <Button
            type="submit"
            className="w-full gradient-primary font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
          >
            Get Free Consultation
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-2">
            We respect your privacy. No spam, ever.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadPopup;
