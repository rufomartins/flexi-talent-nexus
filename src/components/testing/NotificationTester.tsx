import { NotificationPreview } from "@/components/notifications/NotificationPreview";
import { NotificationType } from "@/types/notifications";

export function NotificationTester() {
  const previewConfig = {
    types: [
      NotificationType.DEADLINE_APPROACHING,
      NotificationType.DEADLINE_OVERDUE,
      NotificationType.STATUS_CHANGE,
      NotificationType.NEW_ASSIGNMENT,
    ],
    roles: ['translator', 'reviewer', 'ugc_talent'] as const,
    deadlines: {
      approaching: [1, 3, 7], // Days before deadline
      overdue: [1, 2, 5],    // Days after deadline
    }
  };

  return (
    <div className="container mx-auto p-6">
      <NotificationPreview {...previewConfig} />
    </div>
  );
}