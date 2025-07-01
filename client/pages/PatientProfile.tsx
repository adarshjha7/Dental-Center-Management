import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { getPatients } from "../services/storageService";
import { User, Mail, Phone, Calendar, FileText } from "lucide-react";
import { DATA_EVENTS, addDataUpdateListener } from "../utils/dataEvents";

export default function PatientProfile() {
  const { session } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);

  // Fetch fresh data on component mount and when data changes
  useEffect(() => {
    const refreshData = () => {
      console.log(
        "🔄 PatientProfile: Refreshing data for patient:",
        session?.user?.name,
      );
      setPatients(getPatients());
    };

    refreshData();

    // Listen for custom data update events
    const cleanup = addDataUpdateListener(
      DATA_EVENTS.PATIENTS_UPDATED,
      refreshData,
    );

    // Also refresh on window focus
    window.addEventListener("focus", refreshData);

    return () => {
      cleanup();
      window.removeEventListener("focus", refreshData);
    };
  }, [session?.user?.patientId]);

  const currentPatient = patients.find(
    (p) => p.id === session?.user?.patientId,
  );

  if (!currentPatient) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Patient record not found
          </h2>
          <p className="text-gray-600 mt-2">
            Please contact your dental office for assistance.
          </p>
        </div>
      </div>
    );
  }

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">
          View your personal information and health records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Full Name
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {currentPatient.fullName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Date of Birth
                  </label>
                  <div className="flex items-center space-x-2">
                    <p className="text-lg text-gray-900">
                      {currentPatient.dateOfBirth}
                    </p>
                    <Badge variant="secondary">
                      {calculateAge(currentPatient.dateOfBirth)} years old
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-lg text-gray-900">
                      {currentPatient.email}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Phone
                  </label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-lg text-gray-900">
                      {currentPatient.phone}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Health Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {currentPatient.healthInformation ||
                    "No health information on file."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Patient Since
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">
                {new Date(currentPatient.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Member for{" "}
                {Math.floor(
                  (new Date().getTime() -
                    new Date(currentPatient.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24),
                )}{" "}
                days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Emergency Contact:</strong>
                </p>
                <p>
                  Please update your emergency contact information at your next
                  visit.
                </p>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    Need to update your information? Contact our office at{" "}
                    <strong>(555) 123-DENTIST</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
