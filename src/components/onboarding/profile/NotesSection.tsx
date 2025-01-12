import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NotesSectionProps {
  id: string;
  notes: string;
  onNotesUpdate: (notes: string) => void;
}

export function NotesSection({ id, notes, onNotesUpdate }: NotesSectionProps) {
  const [newNote, setNewNote] = useState("");
  const { toast } = useToast();

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    const updatedNotes = notes 
      ? `${notes}\n${new Date().toISOString()}: ${newNote}`
      : `${new Date().toISOString()}: ${newNote}`;

    const { error } = await supabase
      .from("onboarding_candidates")
      .update({ notes: updatedNotes })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error adding note",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Note added successfully",
    });
    
    onNotesUpdate(updatedNotes);
    setNewNote("");
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-lg font-semibold">Notes</h2>
      
      <div className="space-y-4">
        <div className="min-h-[100px] max-h-[300px] overflow-y-auto space-y-2">
          {notes?.split('\n').map((note, index) => (
            <div key={index} className="text-sm">
              {note}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Textarea
            placeholder="Add a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <Button onClick={handleAddNote} className="w-full">
            Add Note
          </Button>
        </div>
      </div>
    </Card>
  );
}