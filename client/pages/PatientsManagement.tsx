import React, { useState, useEffect } from "react";
import { Patient } from "../types";
import {
  getPatients,
  setPatients,
  getUsers,
  setUsers,
} from "../services/storageService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  Edit,
  Trash2,
  Search,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DATA_EVENTS, dispatchDataUpdate } from "../utils/dataEvents";

export default function PatientsManagement() {
  const [patients, setPatientsState] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletePatientId, setDeletePatientId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    healthInformation: "",
  });

  useEffect(() => {
    setPatientsState(getPatients());
  }, []);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm),
  );

  const resetForm = () => {
    setFormData({
      fullName: "",
      dateOfBirth: "",
      phone: "",
      email: "",
      healthInformation: "",
    });
    setEditingPatient(null);
  };

  const handleOpenDialog = (patient?: Patient) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({
        fullName: patient.fullName,
        dateOfBirth: patient.dateOfBirth,
        phone: patient.phone,
        email: patient.email,
        healthInformation: patient.healthInformation,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentPatients = getPatients();
    const currentUsers = getUsers();

    if (editingPatient) {
      // Update existing patient
      const updatedPatients = currentPatients.map((patient) =>
        patient.id === editingPatient.id
          ? {
              ...patient,
              ...formData,
              updatedAt: new Date().toISOString(),
            }
          : patient,
      );

      // Update corresponding user if email changed
      const updatedUsers = currentUsers.map((user) =>
        user.patientId === editingPatient.id
          ? { ...user, email: formData.email, name: formData.fullName }
          : user,
      );

      setPatients(updatedPatients);
      setUsers(updatedUsers);
      setPatientsState(updatedPatients);

      toast({
        title: "Patient Updated",
        description:
          "Patient information has been successfully updated. Changes are immediately visible to patient.",
      });
    } else {
      // Add new patient
      const newPatientId = Date.now().toString();
      const newPatient: Patient = {
        id: newPatientId,
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Create corresponding user account
      const newUser = {
        id: `user_${newPatientId}`,
        email: formData.email,
        password: "patient123", // Default password for new patients
        name: formData.fullName,
        role: "patient" as const,
        patientId: newPatientId,
      };

      const updatedPatients = [...currentPatients, newPatient];
      const updatedUsers = [...currentUsers, newUser];

      setPatients(updatedPatients);
      setUsers(updatedUsers);
      setPatientsState(updatedPatients);

      toast({
        title: "Patient Added",
        description: `New patient added successfully! Login credentials: ${formData.email} / patient123`,
      });
    }

    // Dispatch custom data update events for immediate same-tab updates
    dispatchDataUpdate(DATA_EVENTS.PATIENTS_UPDATED, {
      patientId: editingPatient?.id || newPatientId,
    });
    dispatchDataUpdate(DATA_EVENTS.USERS_UPDATED);

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (patientId: string) => {
    const currentPatients = getPatients();
    const currentUsers = getUsers();

    const updatedPatients = currentPatients.filter(
      (patient) => patient.id !== patientId,
    );
    const updatedUsers = currentUsers.filter(
      (user) => user.patientId !== patientId,
    );

    setPatients(updatedPatients);
    setUsers(updatedUsers);
    setPatientsState(updatedPatients);
    setDeletePatientId(null);

    // Dispatch custom data update events
    dispatchDataUpdate(DATA_EVENTS.PATIENTS_UPDATED, {
      deletedPatientId: patientId,
    });
    dispatchDataUpdate(DATA_EVENTS.USERS_UPDATED);

    toast({
      title: "Patient Deleted",
      description: "Patient has been successfully deleted.",
      variant: "destructive",
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Patient Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your patients' information and records.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
              className="medical-gradient text-white"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingPatient ? "Edit Patient" : "Add New Patient"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="healthInformation">Health Information</Label>
                <Textarea
                  id="healthInformation"
                  value={formData.healthInformation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      healthInformation: e.target.value,
                    })
                  }
                  placeholder="Enter any relevant health information, allergies, or medical history..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="medical-gradient text-white">
                  {editingPatient ? "Update" : "Add"} Patient
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Patients ({filteredPatients.length})
            {searchTerm && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                - filtered by "{searchTerm}"
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Health Info</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{patient.fullName}</div>
                        <div className="text-sm text-gray-500">
                          DOB: {patient.dateOfBirth}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {calculateAge(patient.dateOfBirth)} years
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {patient.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1" />
                          {patient.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm text-gray-600">
                        {patient.healthInformation || "No information provided"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(patient)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletePatientId(patient.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredPatients.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm
                  ? "No patients found matching your search."
                  : "No patients added yet. Click 'Add Patient' to get started."}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletePatientId}
        onOpenChange={() => setDeletePatientId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              patient and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePatientId && handleDelete(deletePatientId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
