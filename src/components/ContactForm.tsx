import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Phone, Rocket, Send } from "lucide-react";
import { toast } from "sonner";

const ContactForm = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success(
        "Callback request sent successfully! We will contact you soon.",
      );
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <section className="py-32 bg-slate-50/50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-white border border-slate-100 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row min-h-[550px]"
        >
          {/* Left Side - Info */}
          <div className="md:w-2/5 p-12 relative flex flex-col justify-center bg-slate-50 border-r border-slate-100 overflow-hidden">
            {/* Grid Pattern Background */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Rocket className="h-8 w-8 text-primary animate-float" />
              </div>
              <h2 className="text-4xl font-heading font-extrabold mb-4 text-slate-900 leading-tight">
                Request a callback
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Have questions? Our experts are here to help you choose the
                right path.
              </p>

              <div className="space-y-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Or call us directly
                </p>
                <a
                  href="tel:+91 9090909090"
                  className="flex items-center gap-3 text-xl font-bold text-primary hover:underline"
                >
                  <div className="bg-primary text-primary-foreground p-2 rounded-full">
                    <Phone className="h-4 w-4" />
                  </div>
                  +91 9090909090
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-3/5 p-10 md:p-12 bg-background">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-6">
                <div className="space-y-3">
                  <Label htmlFor="fullName" className="text-base font-bold">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Ex: Rohit Sharma"
                    className="h-14 rounded-xl border-border bg-muted/30 focus:bg-background transition-all px-6 text-base"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="mobile" className="text-base font-bold">
                    Mobile Number
                  </Label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                      +91
                    </span>
                    <Input
                      id="mobile"
                      type="tel"
                      pattern="[0-9]{10}"
                      placeholder="9876543210"
                      className="h-14 rounded-xl border-border bg-muted/30 focus:bg-background transition-all pl-16 pr-6 text-base"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <span className="flex items-center gap-3">
                    Let's get started <Send className="h-5 w-5" />
                  </span>
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
