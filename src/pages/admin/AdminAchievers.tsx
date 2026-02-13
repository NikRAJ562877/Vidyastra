import { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2, Edit2, Plus, Upload, GraduationCap } from "lucide-react";
import useAchievers, { Achiever } from "@/hooks/use-achievers";
import { classes } from "@/lib/mock-data";
import { toast } from "sonner";
import { adminNavItems } from "@/lib/nav-config";

const AdminAchievers = () => {
  const { achievers, add, update, remove } = useAchievers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAchiever, setEditingAchiever] = useState<Achiever | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Omit<Achiever, "id" | "rank">>({
    name: "",
    class: "",
    avg: 0,
    imageUrl: "",
    isCustom: true,
  });

  const handleOpenDialog = (achiever: Achiever | null = null) => {
    if (achiever) {
      setEditingAchiever(achiever);
      setFormData({
        name: achiever.name,
        class: achiever.class,
        avg: achiever.avg,
        imageUrl: achiever.imageUrl || "",
        isCustom: achiever.isCustom ?? true,
      });
    } else {
      setEditingAchiever(null);
      setFormData({
        name: "",
        class: "",
        avg: 0,
        imageUrl: "",
        isCustom: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.class || formData.avg <= 0) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    if (editingAchiever) {
      update(editingAchiever.id, formData);
      toast.success("Achiever updated successfully");
    } else {
      add(formData);
      toast.success("Achiever added successfully");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this achiever?")) {
      remove(id);
      toast.success("Achiever removed successfully");
    }
  };

  return (
    <DashboardLayout
      title="Manage Achievers"
      navItems={adminNavItems}
      userName="Admin"
      userRole="admin"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-heading font-bold">Achievers List</h2>
          <p className="text-sm text-muted-foreground">
            Manage top performers displayed on the home page
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gradient-primary">
          <Plus className="h-4 w-4 mr-2" /> Add Achiever
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Average %</TableHead>
              <TableHead>Rank</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {achievers.length > 0 ? (
              achievers.map((achiever) => (
                <TableRow key={achiever.id}>
                  <TableCell>
                    <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                      {achiever.imageUrl ? (
                        <img
                          src={achiever.imageUrl}
                          alt={achiever.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <GraduationCap className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{achiever.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{achiever.class}</Badge>
                  </TableCell>
                  <TableCell>{achiever.avg.toFixed(1)}%</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        achiever.rank <= 3
                          ? "gradient-primary"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      Rank #{achiever.rank}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(achiever)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(achiever.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No achievers found. Add your first top performer!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingAchiever ? "Edit Achiever" : "Add New Achiever"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="w-24 h-24 rounded-full bg-muted overflow-hidden flex items-center justify-center border-2 border-dashed border-border relative">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <GraduationCap className="h-10 w-10 text-muted-foreground opacity-20" />
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                >
                  <Upload className="h-6 w-6 text-white" />
                </button>
              </div>
              <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <p className="text-xs text-muted-foreground italic">
                Click to upload photo
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Student Name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="class">Class *</Label>
                <Input
                  id="class"
                  value={formData.class}
                  onChange={(e) =>
                    setFormData({ ...formData, class: e.target.value })
                  }
                  placeholder="e.g. Class 10"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="avg">Average Percentage *</Label>
                <Input
                  id="avg"
                  type="number"
                  step="0.1"
                  value={formData.avg}
                  onChange={(e) =>
                    setFormData({ ...formData, avg: Number(e.target.value) })
                  }
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gradient-primary">
                {editingAchiever ? "Update Achiever" : "Add Achiever"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminAchievers;
