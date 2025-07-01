import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUsers } from "../services/storageService";

export default function LoginTest() {
  const testAllLogins = () => {
    const users = getUsers();
    const patients = users.filter((u) => u.role === "patient");

    let result = "🧪 LOGIN TEST RESULTS:\n\n";
    result += `📊 Total Users: ${users.length}\n`;
    result += `👥 Total Patients: ${patients.length}\n\n`;
    result += "🔑 PATIENT LOGIN CREDENTIALS:\n";

    patients.forEach((patient, index) => {
      result += `${index + 1}. ${patient.email} / patient123 (${patient.name})\n`;
    });

    result += "\n✅ All these emails should work with password: patient123";
    result +=
      "\n\n🚨 If any don't work, click 'Refresh Data' in admin dashboard!";

    alert(result);
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>🧪 Login Test Helper</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Test all patient login credentials
        </p>
        <Button onClick={testAllLogins} className="w-full">
          Show All Patient Logins
        </Button>
      </CardContent>
    </Card>
  );
}
