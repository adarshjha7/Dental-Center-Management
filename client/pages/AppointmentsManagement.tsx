import React, { useState, useEffect } from "react";
import { Incident, Patient } from "../types";
import {
  getIncidents,
  setIncidents,
  getPatients,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  CalendarPlus,
  Edit,
  Trash2,
  Search,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  FileUp,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { FileUpload } from "../components/FileUpload";

export default function AppointmentsManagement() {
  const [incidents, setIncidentsState] = useState<Incident[]>([]);
  const [patients, setPatientsState] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [deleteIncidentId, setDeleteIncidentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    patientId: "",
    title: "",
    description: "",
    comments: "",
    appointmentDate: "",
    cost: "",
    treatment: "",
    status: "pending" as "pending" | "completed",
    nextDate: "",
  });
  const [incidentFiles, setIncidentFiles] = useState<any[]>([]);

  useEffect(() => {
    setIncidentsState(getIncidents());
    setPatientsState(getPatients());
  }, []);

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || incident.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      patientId: "",
      title: "",
      description: "",
      comments: "",
      appointmentDate: "",
      cost: "",
      treatment: "",
      status: "pending",
      nextDate: "",
    });
    setIncidentFiles([]);
    setEditingIncident(null);
  };

  const handleOpenDialog = (incident?: Incident) => {
    if (incident) {
      setEditingIncident(incident);
      const appointmentDateTime = new Date(incident.appointmentDate);
      const date = appointmentDateTime.toISOString().split("T")[0];
      const time = appointmentDateTime.toTimeString().slice(0, 5);

      setFormData({
        patientId: incident.patientId,
        title: incident.title,
        description: incident.description,
        comments: incident.comments,
        appointmentDate: `${date}T${time}`,
        cost: incident.cost?.toString() || "",
        treatment: incident.treatment || "",
        status: incident.status,
        nextDate: incident.nextDate ? incident.nextDate.split("T")[0] : "",
      });
      setIncidentFiles(incident.files || []);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedPatient = patients.find((p) => p.id === formData.patientId);
    if (!selectedPatient) {
      toast({
        title: "Error",
        description: "Please select a valid patient.",
        variant: "destructive",
      });
      return;
    }

    const currentIncidents = getIncidents();

    const incidentData: Partial<Incident> = {
      patientId: formData.patientId,
      patientName: selectedPatient.fullName,
      title: formData.title,
      description: formData.description,
      comments: formData.comments,
      appointmentDate: formData.appointmentDate,
      cost: formData.cost ? parseFloat(formData.cost) : undefined,
      treatment: formData.treatment,
      status: formData.status,
      nextDate: formData.nextDate ? `${formData.nextDate}T09:00:00` : undefined,
      files: incidentFiles,
    };

    if (editingIncident) {
      const updatedIncidents = currentIncidents.map((incident) =>
        incident.id === editingIncident.id
          ? {
              ...incident,
              ...incidentData,
              updatedAt: new Date().toISOString(),
            }
          : incident,
      );

      setIncidents(updatedIncidents);
      setIncidentsState(updatedIncidents);

      toast({
        title: "Incident Updated",
        description: "Incident updated! Patient will see changes immediately.",
      });
    } else {
      const newIncident: Incident = {
        id: Date.now().toString(),
        ...incidentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Incident;

      const updatedIncidents = [...currentIncidents, newIncident];
      setIncidents(updatedIncidents);
      setIncidentsState(updatedIncidents);

      toast({
        title: "Incident Added",
        description: `Appointment scheduled for ${selectedPatient.fullName}!`,
      });
    }

    console.log(
      "✅ APPOINTMENT SAVED for patient:",
      selectedPatient.fullName,
      "ID:",
      formData.patientId,
    );

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (incidentId: string) => {
    const currentIncidents = getIncidents();
    const updatedIncidents = currentIncidents.filter(
      (incident) => incident.id !== incidentId,
    );

    setIncidents(updatedIncidents);
    setIncidentsState(updatedIncidents);
    setDeleteIncidentId(null);

    toast({
      title: "Incident Deleted",
      description: "Incident deleted successfully.",
      variant: "destructive",
    });
  };

  const pendingCount = incidents.filter(
    (inc) => inc.status === "pending",
  ).length;
  const completedCount = incidents.filter(
    (inc) => inc.status === "completed",
  ).length;
  const todayCount = incidents.filter((inc) => {
    const today = new Date();
    const incidentDate = new Date(inc.appointmentDate);
    return (
      incidentDate.getFullYear() === today.getFullYear() &&
      incidentDate.getMonth() === today.getMonth() &&
      incidentDate.getDate() === today.getDate()
    );
  }).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Appointment Management
          </h1>
          <p className="text-gray-600 mt-1">
            Schedule and manage patient appointments.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => {
              const allIncidents = getIncidents();
              console.log("🏥 All incidents in storage:", allIncidents);
              alert(
                `Storage contains ${allIncidents.length} appointments:\n\n${allIncidents.map((i) => `• ${i.patientName}: ${i.title}`).join("\n")}`,
              );
            }}
            variant="outline"
            size="sm"
          >
            🔍 Check Storage
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => handleOpenDialog()}
                className="medical-gradient text-white"
              >
                <CalendarPlus className="mr-2 h-4 w-4" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingIncident ? "Edit Appointment" : "New Appointment"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient</Label>
                  <Select
                    value={formData.patientId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, patientId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.fullName} - {patient.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Toothache, Routine Checkup"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe the dental issue or procedure..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appointmentDate">Date & Time</Label>
                  <Input
                    id="appointmentDate"
                    type="datetime-local"
                    value={formData.appointmentDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        appointmentDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost ($)</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.cost}
                      onChange={(e) =>
                        setFormData({ ...formData, cost: e.target.value })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "pending" | "completed") =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="treatment">Treatment</Label>
                  <Textarea
                    id="treatment"
                    value={formData.treatment}
                    onChange={(e) =>
                      setFormData({ ...formData, treatment: e.target.value })
                    }
                    placeholder="Treatment performed or planned..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <FileUpload
                    files={incidentFiles}
                    onFilesChange={setIncidentFiles}
                    maxFiles={5}
                    maxSizePerFile={10}
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
                    {editingIncident ? "Update" : "Schedule"} Appointment
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-3xl font-bold text-gray-900">{todayCount}</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-3xl font-bold text-gray-900">
                  {incidents.length}
                </p>
              </div>
              <div className="bg-green-500 p-3 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900">
                  {pendingCount}
                </p>
              </div>
              <div className="bg-yellow-500 p-3 rounded-full">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {completedCount}
                </p>
              </div>
              <div className="bg-purple-500 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Appointments ({filteredIncidents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Files</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.map((incident) => {
                  const appointmentDateTime = new Date(
                    incident.appointmentDate,
                  );

                  return (
                    <TableRow key={incident.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-medium">
                            {incident.patientName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {incident.patientId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            {appointmentDateTime.toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-3 w-3 mr-1" />
                            {appointmentDateTime.toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm font-medium">
                            {incident.title}
                          </p>
                          <p className="text-xs text-gray-600">
                            {incident.description}
                          </p>
                          {incident.cost && (
                            <p className="text-xs text-green-600 font-medium">
                              ${incident.cost}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            incident.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            incident.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {incident.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-500">
                            <FileUp className="h-3 w-3 mr-1" />
                            {incident.files.length} files
                          </div>
                          {incident.files.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {incident.files.map((file, index) => (
                                <Button
                                  key={file.id}
                                  variant="outline"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => {
                                    try {
                                      // Create a blob from base64 data to avoid security issues
                                      const base64Data =
                                        file.data.split(",")[1] || file.data;
                                      const binaryString = atob(base64Data);
                                      const bytes = new Uint8Array(
                                        binaryString.length,
                                      );

                                      for (
                                        let i = 0;
                                        i < binaryString.length;
                                        i++
                                      ) {
                                        bytes[i] = binaryString.charCodeAt(i);
                                      }

                                      const blob = new Blob([bytes], {
                                        type: file.type,
                                      });
                                      const url = URL.createObjectURL(blob);

                                      // If it's an image, open in new tab for viewing
                                      if (file.type.startsWith("image/")) {
                                        window.open(url, "_blank");
                                        // Clean up after a delay
                                        setTimeout(
                                          () => URL.revokeObjectURL(url),
                                          1000,
                                        );
                                      } else {
                                        // For other files, download them
                                        const link =
                                          document.createElement("a");
                                        link.href = url;
                                        link.download = file.name;
                                        link.style.display = "none";
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                        setTimeout(
                                          () => URL.revokeObjectURL(url),
                                          100,
                                        );
                                      }

                                      toast({
                                        title: file.type.startsWith("image/")
                                          ? "Image opened"
                                          : "Download started",
                                        description: `${file.type.startsWith("image/") ? "Viewing" : "Downloading"} ${file.name}`,
                                      });
                                    } catch (error) {
                                      console.error(
                                        "File access error:",
                                        error,
                                      );
                                      toast({
                                        title: "Error",
                                        description: "Failed to access file",
                                        variant: "destructive",
                                      });
                                    }
                                  }}
                                >
                                  {file.name.length > 10
                                    ? `${file.name.substring(0, 10)}...`
                                    : file.name}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(incident)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteIncidentId(incident.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {filteredIncidents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No appointments found. Click 'New Appointment' to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteIncidentId}
        onOpenChange={() => setDeleteIncidentId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              appointment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteIncidentId && handleDelete(deleteIncidentId)}
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
