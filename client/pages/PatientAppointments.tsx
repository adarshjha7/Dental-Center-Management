import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { getIncidents } from "../services/storageService";
import { Calendar, Clock, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DATA_EVENTS, addDataUpdateListener } from "../utils/dataEvents";

export default function PatientAppointments() {
  const { session } = useAuth();

  // Always get fresh data directly - no state caching!
  const freshIncidents = getIncidents();

  console.log("🔄 PatientAppointments RENDER for:", session?.user?.name);
  console.log("📊 FRESH incidents from localStorage:", freshIncidents.length);
  console.log("🎯 My patient ID:", session?.user?.patientId);

  // Filter my incidents - always fresh
  const myIncidents = freshIncidents.filter(
    (inc) => inc.patientId === session?.user?.patientId,
  );

  console.log(
    "✅ My appointments RIGHT NOW:",
    myIncidents.length,
    myIncidents.map((i) => i.title),
  );

  // Force re-render every 1 second
  const [, setForceUpdate] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setForceUpdate((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const upcomingIncidents = myIncidents.filter(
    (inc) => inc.status === "pending",
  );
  const pastIncidents = myIncidents.filter((inc) => inc.status === "completed");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-600 mt-1">
          View your upcoming and past dental appointments.
        </p>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Upcoming Appointments ({upcomingIncidents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingIncidents.map((incident) => (
              <div
                key={incident.id}
                className="p-6 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {incident.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {incident.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(incident.appointmentDate)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTime(incident.appointmentDate)}
                      </div>
                    </div>
                    {incident.cost && (
                      <p className="text-sm text-green-600 font-medium mt-2">
                        Cost: ${incident.cost}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-blue-100 text-blue-800">
                      {incident.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            {upcomingIncidents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No upcoming appointments
                </h3>
                <p>Contact our office to schedule your next appointment.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Past Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Treatment History ({pastIncidents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pastIncidents.map((incident) => (
              <div
                key={incident.id}
                className="p-6 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {incident.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {incident.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Completed on {formatDate(incident.appointmentDate)}
                      </div>
                    </div>
                    {incident.cost && (
                      <p className="text-sm text-green-600 font-medium mt-2">
                        Cost: ${incident.cost}
                      </p>
                    )}
                    {incident.treatment && (
                      <p className="text-sm text-gray-700 mt-2">
                        <strong>Treatment:</strong> {incident.treatment}
                      </p>
                    )}
                    {incident.files.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Attached Files:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {incident.files.map((file) => (
                            <Button
                              key={file.id}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => {
                                try {
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

                                  const link = document.createElement("a");
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
                                } catch (error) {
                                  alert("Failed to download file");
                                }
                              }}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              {file.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-green-100 text-green-800">
                      {incident.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            {pastIncidents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No treatment history
                </h3>
                <p>Your completed treatments will appear here.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Need to Schedule?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-primary text-primary-foreground p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Contact Our Office</h3>
            <p className="text-sm mb-2">
              To schedule, reschedule, or cancel appointments:
            </p>
            <div className="space-y-1 text-sm">
              <p>📞 Phone: (555) 123-DENTIST</p>
              <p>✉️ Email: appointments@dentalcenter.com</p>
              <p>🕒 Hours: Mon-Fri 8AM-6PM, Sat 9AM-3PM</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
