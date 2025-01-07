import { useSearchParams } from "react-router-dom";
import { NewCastingForm } from "@/components/castings/NewCastingForm";
import { CastingType } from "@/types/casting";

export default function NewCastingPage() {
  const [searchParams] = useSearchParams();
  const type = (searchParams.get("type") || "internal") as CastingType;

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-2xl font-semibold mb-6">
        Create New {type === 'internal' ? 'Internal' : 'External'} Casting
      </h1>
      <NewCastingForm type={type} />
    </div>
  );
}