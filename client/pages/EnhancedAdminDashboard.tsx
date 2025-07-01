import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  Clock,
  CheckCircle,
  UserPlus,
  CalendarPlus,
  TrendingUp,
  DollarSign,
  Activity,
  FileText,
  Star,
} from "lucide-react";
import {
  getPatients,
  getIncidents,
  clearAndReinitializeData,
} from "../services/storageService";

export default function EnhancedAdminDashboard() {
  const patients = getPatients();
  const incidents = getIncidents();

  // KPI Calculations
  const pendingIncidents = incidents.filter((inc) => inc.status === "pending");
  const completedIncidents = incidents.filter(
    (inc) => inc.status === "completed",
  );

  // Next 7 appointments
  const upcomingIncidents = incidents
    .filter((inc) => inc.status === "pending")
    .sort(
      (a, b) =>
        new Date(a.appointmentDate).getTime() -
        new Date(b.appointmentDate).getTime(),
    )
    .slice(0, 7);

  // Today's appointments
  const todayIncidents = incidents.filter((inc) => {
    const today = new Date().toISOString().split("T")[0];
    const incidentDate = new Date(inc.appointmentDate)
      .toISOString()
      .split("T")[0];
    return incidentDate === today;
  });

  // Revenue calculation
  const totalRevenue = completedIncidents.reduce(
    (sum, inc) => sum + (inc.cost || 0),
    0,
  );
  const monthlyRevenue = completedIncidents
    .filter((inc) => {
      const incidentMonth = new Date(inc.appointmentDate).getMonth();
      const currentMonth = new Date().getMonth();
      return incidentMonth === currentMonth;
    })
    .reduce((sum, inc) => sum + (inc.cost || 0), 0);

  // Top patients by number of completed treatments
  const patientStats = patients.map((patient) => {
    const patientIncidents = completedIncidents.filter(
      (inc) => inc.patientId === patient.id,
    );
    const totalSpent = patientIncidents.reduce(
      (sum, inc) => sum + (inc.cost || 0),
      0,
    );
    return {
      ...patient,
      completedTreatments: patientIncidents.length,
      totalSpent,
    };
  });

  const topPatients = patientStats
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-500",
      change: `$${monthlyRevenue} this month`,
    },
    {
      title: "Total Patients",
      value: patients.length,
      icon: Users,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Today's Appointments",
      value: todayIncidents.length,
      icon: Calendar,
      color: "bg-purple-500",
      change: `${upcomingIncidents.length} upcoming`,
    },
    {
      title: "Completed Treatments",
      value: completedIncidents.length,
      icon: CheckCircle,
      color: "bg-emerald-500",
      change: `${pendingIncidents.length} pending`,
    },
  ];

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dental Center Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back, Doctor! Here's your practice overview.
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
          <Button asChild variant="outline">
            <Link to="/admin/calendar">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar View
            </Link>
          </Button>
          <Button
            onClick={() => {
              clearAndReinitializeData();
              window.location.reload();
            }}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            🔄 Refresh Data
          </Button>
          <Button
            onClick={() => {
              const users = JSON.parse(
                localStorage.getItem("dental_center_users") || "[]",
              );
              const patients = users.filter((u) => u.role === "patient");
              alert(
                `Working Login Credentials:\n\n${patients.map((p) => `• ${p.email} / patient123 (${p.name})`).join("\n")}\n\nTotal: ${patients.length} patients`,
              );
            }}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            📋 Show Login List
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next 10 Appointments */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Next 7 Appointments
              </CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/appointments">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingIncidents.map((incident) => {
                  const { date, time } = formatDateTime(
                    incident.appointmentDate,
                  );
                  return (
                    <div
                      key={incident.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="text-center">
                            <div className="text-sm font-semibold text-blue-600">
                              {date}
                            </div>
                            <div className="text-xs text-gray-500">{time}</div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {incident.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {incident.patientName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {incident.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {incident.cost && (
                          <span className="text-sm font-medium text-green-600">
                            ${incident.cost}
                          </span>
                        )}
                        <Badge variant="secondary">{incident.status}</Badge>
                      </div>
                    </div>
                  );
                })}
                {upcomingIncidents.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    No upcoming appointments
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Patients */}
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Star className="mr-2 h-5 w-5" />
                Top Patients
              </CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/patients">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPatients.map((patient, index) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {patient.fullName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {patient.completedTreatments} treatments
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">
                        ${patient.totalSpent}
                      </p>
                    </div>
                  </div>
                ))}
                {topPatients.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No patient data yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Treatment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-sm font-medium">
                  {completedIncidents.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="text-sm font-medium">
                  {pendingIncidents.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Today</span>
                <span className="text-sm font-medium">
                  {todayIncidents.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="text-sm font-medium">${totalRevenue}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="text-sm font-medium">${monthlyRevenue}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg per Treatment</span>
                <span className="text-sm font-medium">
                  $
                  {completedIncidents.length > 0
                    ? Math.round(totalRevenue / completedIncidents.length)
                    : 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Files & Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Files</span>
                <span className="text-sm font-medium">
                  {incidents.reduce((sum, inc) => sum + inc.files.length, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Incidents with Files
                </span>
                <span className="text-sm font-medium">
                  {incidents.filter((inc) => inc.files.length > 0).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
