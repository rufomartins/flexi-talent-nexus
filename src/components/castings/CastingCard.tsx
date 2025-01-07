import { Casting } from "./types";

interface CastingCardProps {
  casting: Casting;
}

export function CastingCard({ casting }: CastingCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex">
        <div className="w-24 h-24 flex-shrink-0">
          {casting.logo_url ? (
            <img src={casting.logo_url} alt={casting.name} className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded">
              <span className="text-gray-400">No logo</span>
            </div>
          )}
        </div>
        <div className="ml-6 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{casting.name}</h2>
              <p className="text-gray-600 mt-1">{casting.description}</p>
            </div>
            {casting.client && (
              <div className="text-sm text-gray-600">
                Client: {casting.client.full_name}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3 mt-4">
            <span className="inline-flex items-center space-x-1 text-sm">
              <span className={`w-2 h-2 rounded-full ${casting.status === 'open' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
              <span>{casting.status === 'open' ? 'Open' : 'Closed'}</span>
            </span>
            <span className="text-sm text-gray-600">{casting.talent_count || 0} Talents</span>
            <span className="inline-flex items-center space-x-1 text-sm">
              <span className="w-2 h-2 rounded-full bg-gray-500"></span>
              <span>{casting.guest_remarks_count || 0} Guest remarks</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}