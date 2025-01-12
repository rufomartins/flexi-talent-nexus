interface GuestBriefingProps {
  briefing?: string | null;
  projectDetails?: string;
  clientLogo?: string | null;
}

export const GuestBriefing: React.FC<GuestBriefingProps> = ({
  briefing,
  projectDetails,
  clientLogo,
}) => {
  if (!briefing && !projectDetails && !clientLogo) return null;

  return (
    <div className="mb-8">
      {clientLogo && (
        <img 
          src={clientLogo} 
          alt="Client Logo" 
          className="h-12 mb-4"
        />
      )}
      {briefing && (
        <div 
          className="mt-4 prose max-w-none" 
          dangerouslySetInnerHTML={{ __html: briefing }} 
        />
      )}
      {projectDetails && (
        <p className="mt-2 text-muted-foreground">{projectDetails}</p>
      )}
    </div>
  );
};