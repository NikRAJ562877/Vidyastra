import { useLocation, useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Receipt from "@/components/Receipt";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";

const ReceiptPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // In this mock, we get the data from location state or latest storage
  const enrollmentData = location.state?.enrollment;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <Navbar />
      <div className="container max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 flex justify-between items-center"
        >
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            <Home className="h-4 w-4 mr-2" /> Home
          </Button>
        </motion.div>

        {enrollmentData ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Receipt data={enrollmentData} />

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>
                Thank you for choosing Vidyastara. A copy of this receipt has
                been sent to your email.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p>Receipt not found or expired.</p>
            <Button className="mt-4" onClick={() => navigate("/")}>
              Go to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptPage;
