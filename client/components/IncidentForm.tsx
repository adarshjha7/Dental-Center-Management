import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "./FileUpload";
import { Patient } from "../types";

interface IncidentFormProps {
  formData: {
    patientId: string;
    title: string;
    description: string;
    comments: string;
    appointmentDate: string;
    cost: string;
    treatment: string;
    status: "pending" | "completed";
    nextDate: string;
  };
  setFormData: (data: any) => void;
  patients: Patient[];
  incidentFiles: any[];
  setIncidentFiles: (files: any[]) => void;
  editingIncident: any;
}

export const IncidentForm: React.FC<IncidentFormProps> = ({
  formData,
  setFormData,
  patients,
  incidentFiles,
  setIncidentFiles,
  editingIncident,
}) => {
  return (
    <div className="space-y-4">
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
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
        <Label htmlFor="comments">Comments</Label>
        <Textarea
          id="comments"
          value={formData.comments}
          onChange={(e) =>
            setFormData({ ...formData, comments: e.target.value })
          }
          placeholder="Additional notes or observations..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="appointmentDate">Appointment Date & Time</Label>
        <Input
          id="appointmentDate"
          type="datetime-local"
          value={formData.appointmentDate}
          onChange={(e) =>
            setFormData({ ...formData, appointmentDate: e.target.value })
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
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
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
        <Label htmlFor="nextDate">Next Appointment Date</Label>
        <Input
          id="nextDate"
          type="date"
          value={formData.nextDate}
          onChange={(e) =>
            setFormData({ ...formData, nextDate: e.target.value })
          }
        />
      </div>

      {/* File Upload Section */}
      <div className="space-y-2">
        <FileUpload
          files={incidentFiles}
          onFilesChange={setIncidentFiles}
          maxFiles={5}
          maxSizePerFile={10}
        />
      </div>
    </div>
  );
};
