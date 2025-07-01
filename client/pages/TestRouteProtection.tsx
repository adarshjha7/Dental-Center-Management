import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function TestRouteProtection() {
  const { session } = useAuth();

  const testResults = [
    {
      test: "Authentication Check",
      result: !!session?.isAuthenticated,
      description: "User should be authenticated to access this page",
    },
    {
      test: "Role-based Access",
      result: session?.user?.role === "admin",
      description: "Only admin users should access admin routes",
    },
    {
      test: "Session Persistence",
      result: !!localStorage.getItem("dental_center_auth_session"),
      description: "Session should persist in localStorage",
    },
    {
      test: "User Data Available",
      result: !!(session?.user?.name && session?.user?.email),
      description: "User profile data should be accessible",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Shield className="mr-3 h-8 w-8 text-blue-600" />
          Route Protection Test
        </h1>
        <p className="text-gray-600 mt-1">
          Testing authentication and authorization functionality.
        </p>
      </div>

      {/* Current Session Info */}
      <Card>
        <CardHeader>
          <CardTitle>Current Session</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                User Name
              </label>
              <p className="text-lg font-semibold">
                {session?.user?.name || "Not available"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-lg">
                {session?.user?.email || "Not available"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Role</label>
              <Badge
                variant={
                  session?.user?.role === "admin" ? "default" : "secondary"
                }
              >
                {session?.user?.role || "Unknown"}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Login Time
              </label>
              <p className="text-sm text-gray-600">
                {session?.loginTime
                  ? new Date(session.loginTime).toLocaleString()
                  : "Not available"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Protection Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testResults.map((test, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{test.test}</h3>
                  <p className="text-sm text-gray-600">{test.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {test.result ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                  <Badge
                    variant={test.result ? "default" : "destructive"}
                    className={
                      test.result
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {test.result ? "PASS" : "FAIL"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-amber-600" />
            How to Test Route Protection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <strong>1. Authentication Test:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>
                  Logout and try to access /admin directly - should redirect to
                  login
                </li>
                <li>
                  Login and refresh page - should stay logged in (localStorage
                  working)
                </li>
              </ul>
            </div>
            <div>
              <strong>2. Role-based Access Test:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>
                  Login as patient, try to access /admin/* - should redirect to
                  /patient
                </li>
                <li>
                  Login as admin, try to access /patient/* - should redirect to
                  /admin
                </li>
              </ul>
            </div>
            <div>
              <strong>3. Session Persistence Test:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>
                  Login, close browser tab, open new tab with same URL - should
                  stay logged in
                </li>
                <li>
                  Check browser DevTools Application LocalStorage for session
                  data
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Test Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => console.log("Current session:", session)}
              variant="outline"
            >
              Log Session to Console
            </Button>
            <Button
              onClick={() => {
                const sessionData = localStorage.getItem(
                  "dental_center_auth_session",
                );
                console.log("LocalStorage session:", sessionData);
                alert(
                  sessionData
                    ? "Session found in localStorage!"
                    : "No session in localStorage",
                );
              }}
              variant="outline"
            >
              Check localStorage
            </Button>
            <Button
              onClick={() => window.open("/admin", "_blank")}
              variant="outline"
            >
              Test Admin Route (New Tab)
            </Button>
            <Button
              onClick={() => window.open("/patient", "_blank")}
              variant="outline"
            >
              Test Patient Route (New Tab)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
