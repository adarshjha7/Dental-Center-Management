export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "admin" | "patient";
  patientId?: string; // Reference to patient record if user is a patient
}

export interface Patient {
  id: string;
  fullName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  healthInformation: string;
  createdAt: string;
  updatedAt: string;
}

export interface Incident {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  description: string;
  comments: string;
  appointmentDate: string; // ISO datetime string
  cost?: number;
  treatment?: string;
  status: "pending" | "completed";
  nextDate?: string;
  files: AppointmentFile[];
  createdAt: string;
  updatedAt: string;
}

// Keep Appointment for backward compatibility
export interface Appointment extends Incident {}

export interface AppointmentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // base64 encoded file data
  uploadedAt: string;
}

export interface AuthSession {
  user: User;
  isAuthenticated: boolean;
  loginTime: string;
}

export interface AuthContextType {
  session: AuthSession | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface PatientContextType {
  patients: Patient[];
  addPatient: (
    patient: Omit<Patient, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  getPatient: (id: string) => Patient | undefined;
}

export interface IncidentContextType {
  incidents: Incident[];
  addIncident: (
    incident: Omit<Incident, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateIncident: (id: string, incident: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;
  getIncidentsByPatient: (patientId: string) => Incident[];
  addFileToIncident: (
    incidentId: string,
    file: Omit<AppointmentFile, "id" | "uploadedAt">,
  ) => void;
  removeFileFromIncident: (incidentId: string, fileId: string) => void;
}

// Keep AppointmentContextType for backward compatibility
export interface AppointmentContextType extends IncidentContextType {
  appointments: Incident[];
  addAppointment: (
    appointment: Omit<Incident, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateAppointment: (id: string, appointment: Partial<Incident>) => void;
  deleteAppointment: (id: string) => void;
  getAppointmentsByPatient: (patientId: string) => Incident[];
  addFileToAppointment: (
    appointmentId: string,
    file: Omit<AppointmentFile, "id" | "uploadedAt">,
  ) => void;
  removeFileFromAppointment: (appointmentId: string, fileId: string) => void;
}
