import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  runDeadlineTests,
  runPreferenceTests,
  runRoleTests,
  verifyNotifications
} from "@/utils/__tests__/notificationTestUtils";

export function NotificationTester({ userId }: { userId: string }) {
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const runAllTests = async () => {
    try {
      setIsRunning(true);
      
      // Run all test scenarios
      await runDeadlineTests(userId);
      await runPreferenceTests(userId);
      await runRoleTests(userId);
      
      // Verify notifications
      const notifications = await verifyNotifications(userId);
      
      toast({
        title: "Tests completed",
        description: `Generated ${notifications.length} notifications`,
      });
    } catch (error) {
      console.error('Test error:', error);
      toast({
        title: "Test Error",
        description: "Failed to run notification tests",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification System Tester</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runAllTests}
          disabled={isRunning}
        >
          {isRunning ? "Running Tests..." : "Run All Tests"}
        </Button>
      </CardContent>
    </Card>
  );
}