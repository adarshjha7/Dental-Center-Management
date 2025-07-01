import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getIncidents, getPatients } from "../services/storageService";
import { useAuth } from "../contexts/AuthContext";

export default function DataTest() {
  const { session } = useAuth();
  const [refreshCount, setRefreshCount] = useState(0);

  const testData = () => {
    const allIncidents = getIncidents();
    const allPatients = getPatients();

    const myIncidents = allIncidents.filter(
      (inc) => inc.patientId === session?.user?.patientId,
    );

    console.log("=== DATA TEST ===");
    console.log("User:", session?.user?.name);
    console.log("Patient ID:", session?.user?.patientId);
    console.log("All incidents:", allIncidents.length, allIncidents);
    console.log("My incidents:", myIncidents.length, myIncidents);

    alert(`
DATA TEST RESULTS:
- Your name: ${session?.user?.name}
- Your patient ID: ${session?.user?.patientId}
- Total incidents in system: ${allIncidents.length}
- Your incidents: ${myIncidents.length}

Your appointments:
${myIncidents.map((i) => `• ${i.title} (${i.status})`).join("\n")}
    `);
  };

  return (
    <div className="max-w-lg mx-auto mt-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Data Sync Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Logged in as: {session?.user?.name}</p>
          <p>Patient ID: {session?.user?.patientId}</p>
          <p>Refresh count: {refreshCount}</p>

          <div className="space-y-2">
            <Button onClick={testData} className="w-full">
              Test My Data Now
            </Button>

            <Button
              onClick={() => setRefreshCount((prev) => prev + 1)}
              variant="outline"
              className="w-full"
            >
              Force Refresh ({refreshCount})
            </Button>
          </div>

          <div className="bg-gray-100 p-3 rounded text-sm">
            <strong>Instructions:</strong>
            <br />
            1. Login as admin and create appointment
            <br />
            2. Come back here and click "Test My Data Now"
            <br />
            3. Should show your new appointment
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
