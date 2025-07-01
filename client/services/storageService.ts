import { User, Patient, Incident, AuthSession } from "../types";

const STORAGE_KEYS = {
  USERS: "dental_center_users",
  PATIENTS: "dental_center_patients",
  INCIDENTS: "dental_center_incidents",
  APPOINTMENTS: "dental_center_incidents", // Backward compatibility
  AUTH_SESSION: "dental_center_auth_session",
} as const;

// Initialize default data
const initializeDefaultData = () => {
  // Default users - exactly 7 patients with login credentials
  const defaultUsers: User[] = [
    {
      id: "1",
      email: "admin@dentalcenter.com",
      password: "admin123",
      name: "Dr. Sarah Johnson",
      role: "admin",
    },
    {
      id: "2",
      email: "patient@example.com",
      password: "patient123",
      name: "John Smith",
      role: "patient",
      patientId: "1",
    },
    {
      id: "3",
      email: "adarsh@example.com",
      password: "patient123",
      name: "Adarsh Jha",
      role: "patient",
      patientId: "2",
    },
    {
      id: "4",
      email: "abhay@example.com",
      password: "patient123",
      name: "Abhay Kumar",
      role: "patient",
      patientId: "3",
    },
    {
      id: "5",
      email: "robert@example.com",
      password: "patient123",
      name: "Robert Davis",
      role: "patient",
      patientId: "4",
    },
    {
      id: "6",
      email: "priya@example.com",
      password: "patient123",
      name: "Priya Sharma",
      role: "patient",
      patientId: "5",
    },
    {
      id: "7",
      email: "rahul@example.com",
      password: "patient123",
      name: "Rahul Verma",
      role: "patient",
      patientId: "6",
    },
    {
      id: "8",
      email: "neha@example.com",
      password: "patient123",
      name: "Neha Gupta",
      role: "patient",
      patientId: "7",
    },
  ];

  // Default patients - exactly 7 patients
  const defaultPatients: Patient[] = [
    {
      id: "1",
      fullName: "John Smith",
      dateOfBirth: "1985-06-15",
      phone: "(555) 123-4567",
      email: "patient@example.com",
      healthInformation: "No allergies. Previous root canal treatment in 2020.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      fullName: "Adarsh Jha",
      dateOfBirth: "1992-08-12",
      phone: "(555) 234-5678",
      email: "adarsh@example.com",
      healthInformation:
        "Mild sensitivity to cold foods. Orthodontic treatment completed in 2018.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      fullName: "Abhay Kumar",
      dateOfBirth: "1988-04-25",
      phone: "(555) 345-6789",
      email: "abhay@example.com",
      healthInformation:
        "History of dental anxiety. Prefers sedation for major procedures.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "4",
      fullName: "Robert Davis",
      dateOfBirth: "1990-11-08",
      phone: "(555) 456-7890",
      email: "robert@example.com",
      healthInformation:
        "Gum disease treatment ongoing. Dental implant consultation scheduled.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "5",
      fullName: "Priya Sharma",
      dateOfBirth: "1995-12-03",
      phone: "(555) 567-8901",
      email: "priya@example.com",
      healthInformation:
        "Perfect dental health. Regular cleanings every 6 months.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "6",
      fullName: "Rahul Verma",
      dateOfBirth: "1987-09-18",
      phone: "(555) 678-9012",
      email: "rahul@example.com",
      healthInformation: "Wisdom teeth extraction needed. Allergic to latex.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "7",
      fullName: "Neha Gupta",
      dateOfBirth: "1993-01-30",
      phone: "(555) 789-0123",
      email: "neha@example.com",
      healthInformation:
        "Braces removed last year. Maintains excellent oral hygiene.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Default incidents (appointments) - exactly 7 incidents
  const defaultIncidents: Incident[] = [
    {
      id: "i1",
      patientId: "1",
      patientName: "John Smith",
      title: "Root Canal Follow-up",
      description: "Follow-up for root canal treatment",
      comments: "Patient reports no pain, healing well",
      appointmentDate: "2024-01-15T09:00:00",
      cost: 150,
      treatment: "Root canal maintenance checkup",
      status: "completed",
      nextDate: "2024-07-15T09:00:00",
      files: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "i2",
      patientId: "2",
      patientName: "Adarsh Jha",
      title: "Toothache",
      description: "Upper molar pain and sensitivity",
      comments: "Sensitive to cold foods and pressure",
      appointmentDate: "2024-01-18T14:30:00",
      cost: 80,
      treatment: "Dental sensitivity treatment",
      status: "pending",
      files: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "i3",
      patientId: "3",
      patientName: "Abhay Kumar",
      title: "Routine Checkup",
      description: "Regular dental examination with sedation",
      comments: "Patient has dental anxiety, requires mild sedation",
      appointmentDate: "2024-01-20T10:00:00",
      cost: 120,
      treatment: "Complete oral examination with cleaning",
      status: "completed",
      nextDate: "2024-07-20T10:00:00",
      files: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "i4",
      patientId: "4",
      patientName: "Robert Davis",
      title: "Gum Disease Treatment",
      description: "Deep cleaning and gum therapy session",
      comments: "Moderate gum disease, requires ongoing treatment",
      appointmentDate: "2024-01-22T15:00:00",
      cost: 200,
      treatment: "Periodontal therapy session",
      status: "pending",
      nextDate: "2024-02-22T15:00:00",
      files: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "i5",
      patientId: "5",
      patientName: "Priya Sharma",
      title: "Regular Cleaning",
      description: "Routine dental cleaning and polishing",
      comments: "Excellent oral hygiene maintained",
      appointmentDate: "2024-01-25T13:00:00",
      cost: 75,
      treatment: "Professional cleaning and polishing",
      status: "completed",
      nextDate: "2024-07-25T13:00:00",
      files: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "i6",
      patientId: "6",
      patientName: "Rahul Verma",
      title: "Wisdom Teeth Consultation",
      description: "Consultation for wisdom teeth extraction",
      comments: "All four wisdom teeth impacted, extraction recommended",
      appointmentDate: "2024-01-28T16:30:00",
      cost: 50,
      treatment: "Wisdom teeth extraction consultation",
      status: "pending",
      nextDate: "2024-02-15T08:00:00",
      files: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "i7",
      patientId: "7",
      patientName: "Neha Gupta",
      title: "Post-Braces Checkup",
      description: "Follow-up after braces removal",
      comments: "Teeth alignment excellent, retainer fitting scheduled",
      appointmentDate: "2024-01-30T11:00:00",
      cost: 100,
      treatment: "Post-orthodontic examination and retainer fitting",
      status: "pending",
      files: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Only initialize if data doesn't exist
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    localStorage.setItem(
      STORAGE_KEYS.PATIENTS,
      JSON.stringify(defaultPatients),
    );
  }
  if (!localStorage.getItem(STORAGE_KEYS.INCIDENTS)) {
    localStorage.setItem(
      STORAGE_KEYS.INCIDENTS,
      JSON.stringify(defaultIncidents),
    );
  }
};

// Generic storage functions
const get = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error getting ${key} from storage:`, error);
    return [];
  }
};

const set = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error setting ${key} in storage:`, error);
  }
};

// Users
export const getUsers = (): User[] => get<User>(STORAGE_KEYS.USERS);
export const setUsers = (users: User[]): void =>
  set<User>(STORAGE_KEYS.USERS, users);

// Patients
export const getPatients = (): Patient[] => get<Patient>(STORAGE_KEYS.PATIENTS);
export const setPatients = (patients: Patient[]): void =>
  set<Patient>(STORAGE_KEYS.PATIENTS, patients);

// Incidents (Appointments)
export const getIncidents = (): Incident[] =>
  get<Incident>(STORAGE_KEYS.INCIDENTS);
export const setIncidents = (incidents: Incident[]): void =>
  set<Incident>(STORAGE_KEYS.INCIDENTS, incidents);

// Backward compatibility
export const getAppointments = (): Incident[] => getIncidents();
export const setAppointments = (appointments: Incident[]): void =>
  setIncidents(appointments);

// Auth Session
export const getAuthSession = (): AuthSession | null => {
  try {
    const session = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error("Error getting auth session:", error);
    return null;
  }
};

export const setAuthSession = (session: AuthSession | null): void => {
  try {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    }
  } catch (error) {
    console.error("Error setting auth session:", error);
  }
};

// Clear and reinitialize data (for development)
export const clearAndReinitializeData = () => {
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.PATIENTS);
  localStorage.removeItem(STORAGE_KEYS.INCIDENTS);
  localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  initializeDefaultData();
};

// Force clear old data and reinitialize (for development)
const forceReinitialize = () => {
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.PATIENTS);
  localStorage.removeItem(STORAGE_KEYS.INCIDENTS);
  // Don't clear auth session to avoid logging out
  initializeDefaultData();
};

// Check if we need to force reinitialize
const currentUsers = localStorage.getItem(STORAGE_KEYS.USERS);
if (!currentUsers || JSON.parse(currentUsers).length !== 8) {
  // 1 admin + 7 patients
  forceReinitialize();
} else {
  initializeDefaultData();
}
