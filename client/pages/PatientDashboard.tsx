import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { getPatients, getIncidents } from "../services/storageService";
import { Calendar, User, FileText, Clock } from "lucide-react";
import { DATA_EVENTS, addDataUpdateListener } from "../utils/dataEvents";

export default function PatientDashboard() {
  const { session } = useAuth();

  // Always get fresh data directly from localStorage - no caching!
  const freshPatients = getPatients();
  const freshIncidents = getIncidents();

  console.log("🔄 PatientDashboard RENDER for:", session?.user?.name);
  console.log("📊 FRESH incidents from localStorage:", freshIncidents.length);
  console.log("🎯 My patient ID:", session?.user?.patientId);

  // Find current patient's data - always fresh
  const currentPatient = freshPatients.find(
    (p) => p.id === session?.user?.patientId,
  );

  // Filter my incidents - always fresh
  const myIncidents = freshIncidents.filter(
    (inc) => inc.patientId === session?.user?.patientId,
  );

  console.log(
    "✅ My incidents RIGHT NOW:",
    myIncidents.length,
    myIncidents.map((i) => i.title),
  );

  const upcomingIncidents = myIncidents.filter(
    (inc) => inc.status === "pending",
  );
  const completedIncidents = myIncidents.filter(
    (inc) => inc.status === "completed",
  );

  // Force re-render every 1 second to always show fresh data
  const [, setForceUpdate] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setForceUpdate((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Data is already calculated above - no need to repeat

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {currentPatient.fullName}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's your dental care overview and upcoming appointments.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Upcoming Appointments
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {upcomingIncidents.length}
                </p>
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
                <p className="text-sm font-medium text-gray-600">
                  Medical Files
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {myIncidents.reduce(
                    (total, inc) => total + inc.files.length,
                    0,
                  )}
                </p>
              </div>
              <div className="bg-green-500 p-3 rounded-full">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Patient Since
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {new Date(currentPatient.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-purple-500 p-3 rounded-full">
                <User className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {incident.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(
                          incident.appointmentDate,
                        ).toLocaleDateString()}{" "}
                        at{" "}
                        {new Date(incident.appointmentDate).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          },
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {incident.description}
                      </p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      {incident.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {upcomingIncidents.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No upcoming appointments
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Recent Treatments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedIncidents.slice(0, 3).map((incident) => (
                <div
                  key={incident.id}
                  className="p-4 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {incident.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Completed on{" "}
                        {new Date(
                          incident.appointmentDate,
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {incident.description}
                      </p>
                      {incident.cost && (
                        <p className="text-xs text-green-600 font-medium mt-1">
                          Cost: ${incident.cost}
                        </p>
                      )}
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {incident.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {completedIncidents.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No completed treatments yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-600">
            <p>Need to schedule an appointment or have questions?</p>
            <p className="mt-2">
              <strong>Contact us:</strong> Call (555) 123-DENTIST or email
              admin@dentalcenter.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
