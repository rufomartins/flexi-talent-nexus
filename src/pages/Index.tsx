import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-3xl w-full px-6 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Global Talent Management Division
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Welcome to our talent management platform
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button 
            variant="default"
            size="lg"
            onClick={() => navigate("/login")}
          >
            Admin Login
          </Button>
        </div>
      </div>
    </div>
  );
}