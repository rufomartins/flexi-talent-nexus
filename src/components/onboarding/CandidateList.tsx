import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, MessageSquare, Filter } from "lucide-react";
import { OnboardingEmailComposer } from "./email/OnboardingEmailComposer";
import { EmailAndSmsComposer } from "./communication/EmailAndSmsComposer";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
  communication_status?: string;
}

interface CandidateListProps {
  candidates: Candidate[];
  isLoading: boolean;
  error: Error | null;
}

export function CandidateList({ candidates, isLoading, error }: CandidateListProps) {
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);
  const [isSmsComposerOpen, setIsSmsComposerOpen] = useState(false);
  const [communicationFilter, setCommunicationFilter] = useState<string>("all");

  // Query for communication metrics
  const { data: metrics } = useQuery({
    queryKey: ['communication-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_logs')
        .select('notification_type, status')
        .in('notification_type', ['EMAIL', 'SMS']);

      if (error) {
        console.error('Error fetching metrics:', error);
        return {
          emailsSent: 0,
          smsSent: 0,
          successRate: 0,
          failureRate: 0
        };
      }

      const total = data.length;
      const successful = data.filter(log => log.status === 'sent').length;
      
      return {
        emailsSent: data.filter(log => log.notification_type === 'EMAIL').length,
        smsSent: data.filter(log => log.notification_type === 'SMS').length,
        successRate: total ? (successful / total) * 100 : 0,
        failureRate: total ? ((total - successful) / total) * 100 : 0
      };
    }
  });

  const handleSelectCandidate = (candidate: Candidate) => {
    if (selectedCandidates.find(c => c.id === candidate.id)) {
      setSelectedCandidates(selectedCandidates.filter(c => c.id !== candidate.id));
    } else {
      setSelectedCandidates([...selectedCandidates, candidate]);
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    if (communicationFilter === "all") return true;
    return candidate.communication_status === communicationFilter;
  });

  if (isLoading) {
    return <div>Loading candidates...</div>;
  }

  if (error) {
    return <div>Error loading candidates: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <span>{selectedCandidates.length} candidate(s) selected</span>
          <Select
            value={communicationFilter}
            onValueChange={setCommunicationFilter}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Candidates</SelectItem>
              <SelectItem value="email_sent">Email Sent</SelectItem>
              <SelectItem value="sms_sent">SMS Sent</SelectItem>
              <SelectItem value="no_response">No Response</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {selectedCandidates.length > 0 && (
          <div className="flex gap-2">
            <Button
              onClick={() => setIsEmailComposerOpen(true)}
              size="sm"
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Send Email
            </Button>
            <Button
              onClick={() => setIsSmsComposerOpen(true)}
              size="sm"
              variant="secondary"
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Send SMS
            </Button>
          </div>
        )}
      </div>

      {metrics && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-card p-4 rounded-lg">
            <h3 className="text-sm font-medium">Emails Sent</h3>
            <p className="text-2xl font-bold">{metrics.emailsSent}</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <h3 className="text-sm font-medium">SMS Sent</h3>
            <p className="text-2xl font-bold">{metrics.smsSent}</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <h3 className="text-sm font-medium">Success Rate</h3>
            <p className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <h3 className="text-sm font-medium">Failure Rate</h3>
            <p className="text-2xl font-bold">{metrics.failureRate.toFixed(1)}%</p>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={selectedCandidates.length === candidates.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCandidates(candidates);
                    } else {
                      setSelectedCandidates([]);
                    }
                  }}
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Phone</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Communication</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredCandidates.map((candidate) => (
              <tr key={candidate.id}>
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedCandidates.some(c => c.id === candidate.id)}
                    onCheckedChange={() => handleSelectCandidate(candidate)}
                  />
                </td>
                <td className="px-4 py-3">{candidate.name}</td>
                <td className="px-4 py-3">{candidate.email}</td>
                <td className="px-4 py-3">{candidate.phone}</td>
                <td className="px-4 py-3">{candidate.status}</td>
                <td className="px-4 py-3">
                  <Badge variant={
                    candidate.communication_status === 'email_sent' ? 'default' :
                    candidate.communication_status === 'sms_sent' ? 'secondary' :
                    'outline'
                  }>
                    {candidate.communication_status || 'No Contact'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedCandidates([candidate]);
                        setIsEmailComposerOpen(true);
                      }}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedCandidates([candidate]);
                        setIsSmsComposerOpen(true);
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OnboardingEmailComposer
        open={isEmailComposerOpen}
        onOpenChange={setIsEmailComposerOpen}
        selectedCandidates={selectedCandidates.map(c => ({
          id: c.id,
          name: c.name,
          email: c.email
        }))}
      />

      {isSmsComposerOpen && selectedCandidates.length > 0 && (
        <EmailAndSmsComposer
          candidateId={selectedCandidates[0].id}
          candidateName={selectedCandidates[0].name}
          phone={selectedCandidates[0].phone}
          open={isSmsComposerOpen}
          onOpenChange={setIsSmsComposerOpen}
          mode="sms"
          selectedCandidates={selectedCandidates}
        />
      )}
    </div>
  );
}