import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  Clock,
  CheckCircle,
  UserPlus,
  CalendarPlus,
  TrendingUp,
} from "lucide-react";
import { getPatients, getAppointments } from "../services/storageService";

export default function AdminDashboard() {
  const patients = getPatients();
  const appointments = getAppointments();

  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "pending",
  );
  const completedAppointments = appointments.filter(
    (apt) => apt.status === "completed",
  );

  const todayAppointments = appointments.filter((apt) => {
    const today = new Date().toISOString().split("T")[0];
    return apt.date === today;
  });

  const stats = [
    {
      title: "Total Patients",
      value: patients.length,
      icon: Users,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Today's Appointments",
      value: todayAppointments.length,
      icon: Calendar,
      color: "bg-green-500",
      change: "+5%",
    },
    {
      title: "Pending Appointments",
      value: pendingAppointments.length,
      icon: Clock,
      color: "bg-yellow-500",
      change: "-8%",
    },
    {
      title: "Completed This Month",
      value: completedAppointments.length,
      icon: CheckCircle,
      color: "bg-purple-500",
      change: "+23%",
    },
  ];

  const recentAppointments = appointments
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const recentPatients = patients
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, Doctor!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening at your dental center today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild className="medical-gradient text-white">
            <Link to="/admin/patients">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Patient
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/appointments">
              <CalendarPlus className="mr-2 h-4 w-4" />
              New Appointment
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/test-protection">🛡️ Test Protection</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Appointments</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/appointments">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {appointment.patientName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {appointment.treatmentDescription}
                    </p>
                    <p className="text-xs text-gray-500">
                      {appointment.date} at {appointment.time}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        appointment.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
              {recentAppointments.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No appointments yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Patients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Patients</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/patients">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {patient.fullName}
                    </p>
                    <p className="text-sm text-gray-600">{patient.email}</p>
                    <p className="text-xs text-gray-500">{patient.phone}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(patient.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {recentPatients.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No patients yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
