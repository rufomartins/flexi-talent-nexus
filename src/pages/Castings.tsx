
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import CastingList from "@/components/castings/CastingList";
import { FileText, Plus } from "lucide-react";

export default function Castings() {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Castings</h1>
          <p className="text-muted-foreground">
            Manage your casting calls and talent selections
          </p>
        </div>
        <Button 
          onClick={() => navigate('/castings/new')} 
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Casting</span>
        </Button>
      </div>
      
      <CastingList />
    </div>
  );
}
