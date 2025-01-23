import { AgoraSettings } from "@/components/settings/AgoraSettings";

export default function Settings() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <AgoraSettings />
    </div>
  );
}