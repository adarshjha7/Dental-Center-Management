import React, { useState, useEffect } from "react";
import { getIncidents } from "../services/storageService";
import { Incident } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  DollarSign,
} from "lucide-react";

export default function CalendarView() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    setIncidents(getIncidents());
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }

    // Next month days to complete the grid
    const totalCells = Math.ceil(days.length / 7) * 7;
    for (let day = 1; days.length < totalCells; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(startOfWeek);
      weekDay.setDate(startOfWeek.getDate() + i);
      days.push({ date: weekDay, isCurrentMonth: true });
    }
    return days;
  };

  const getIncidentsForDate = (date: Date) => {
    // const dateStr = date.toISOString().split("T")[0];
    const targetYear = date.getFullYear();
    const targetMonth = date.getMonth();
    const targetDay = date.getDate();
    return incidents.filter((incident) => {
      // const incidentDate = new Date(incident.appointmentDate)
      //   .toISOString()
      //   .split("T")[0];
      // return incidentDate === dateStr;
      const incidentDate = new Date(incident.appointmentDate);
      return (
        incidentDate.getFullYear() === targetYear &&
        incidentDate.getMonth() === targetMonth &&
        incidentDate.getDate() === targetDay
      );
    });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const navigate = (direction: "prev" | "next") => {
    if (viewMode === "month") {
      navigateMonth(direction);
    } else {
      navigateWeek(direction);
    }
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const formatWeek = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    return `${startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  const days =
    viewMode === "month"
      ? getDaysInMonth(currentDate)
      : getWeekDays(currentDate);
  const selectedDateIncidents = selectedDate
    ? getIncidentsForDate(selectedDate)
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar View</h1>
          <p className="text-gray-600 mt-1">
            {viewMode === "month" ? "Monthly" : "Weekly"} view of scheduled
            treatments
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "month" ? "default" : "outline"}
            onClick={() => setViewMode("month")}
            size="sm"
          >
            Month
          </Button>
          <Button
            variant={viewMode === "week" ? "default" : "outline"}
            onClick={() => setViewMode("week")}
            size="sm"
          >
            Week
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {viewMode === "month"
                    ? formatMonth(currentDate)
                    : formatWeek(currentDate)}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("prev")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("next")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="p-2 text-center text-sm font-medium text-gray-500 border-b"
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>

              <div
                className={`grid grid-cols-7 gap-1 ${viewMode === "week" ? "h-96" : ""}`}
              >
                {days.map((day, index) => {
                  const dayIncidents = getIncidentsForDate(day.date);
                  const isToday =
                    day.date.toDateString() === new Date().toDateString();
                  const isSelected =
                    selectedDate?.toDateString() === day.date.toDateString();

                  return (
                    <div
                      key={index}
                      className={`
                        min-h-24 p-2 border border-gray-200 cursor-pointer transition-colors
                        ${!day.isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white"}
                        ${isToday ? "bg-blue-50 border-blue-200" : ""}
                        ${isSelected ? "bg-blue-100 border-blue-300" : ""}
                        ${viewMode === "week" ? "min-h-32" : ""}
                        hover:bg-gray-50
                      `}
                      onClick={() => setSelectedDate(day.date)}
                    >
                      <div
                        className={`text-sm ${isToday ? "font-bold text-blue-600" : ""}`}
                      >
                        {day.date.getDate()}
                      </div>

                      {/* Incidents for this day */}
                      <div className="mt-1 space-y-1">
                        {dayIncidents
                          .slice(0, viewMode === "week" ? 4 : 2)
                          .map((incident) => (
                            <div
                              key={incident.id}
                              className={`text-xs p-1 rounded truncate ${
                                incident.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                              title={`${incident.title} - ${incident.patientName}`}
                            >
                              {new Date(
                                incident.appointmentDate,
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}{" "}
                              {incident.title}
                            </div>
                          ))}
                        {dayIncidents.length >
                          (viewMode === "week" ? 4 : 2) && (
                          <div className="text-xs text-gray-500">
                            +
                            {dayIncidents.length -
                              (viewMode === "week" ? 4 : 2)}{" "}
                            more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Day Details */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate
                  ? selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })
                  : "Select a date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                <div className="space-y-4">
                  {selectedDateIncidents.length > 0 ? (
                    selectedDateIncidents.map((incident) => (
                      <div
                        key={incident.id}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">
                            {incident.title}
                          </h4>
                          <Badge
                            variant={
                              incident.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              incident.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }
                          >
                            {incident.status}
                          </Badge>
                        </div>

                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(
                              incident.appointmentDate,
                            ).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </div>
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {incident.patientName}
                          </div>
                          {incident.cost && (
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />$
                              {incident.cost}
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-gray-700 mt-2">
                          {incident.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No appointments scheduled
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  Click on a date to view scheduled treatments
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
