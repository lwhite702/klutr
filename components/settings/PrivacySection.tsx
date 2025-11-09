"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle } from "lucide-react";

export function PrivacySection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Privacy
        </CardTitle>
        <CardDescription>Control your data and privacy settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Analytics</Label>
            <p className="text-sm text-muted-foreground">
              Help us improve by sharing anonymous usage data
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Error Reporting</Label>
            <p className="text-sm text-muted-foreground">
              Automatically report errors to help fix bugs
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your notes are encrypted and stored securely. We never access your content.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

