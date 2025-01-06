import { Button } from "@/components/ui/button"
import { useState } from "react"
import { AddTalentModal } from "@/components/talents/AddTalentModal"

export default function Dashboard() {
  const [addTalentOpen, setAddTalentOpen] = useState(false)

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={() => setAddTalentOpen(true)}>
          Add new talent
        </Button>
      </div>

      <AddTalentModal 
        open={addTalentOpen}
        onOpenChange={setAddTalentOpen}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Total Talents</h2>
          <p className="text-3xl font-bold">0</p>
        </div>
        
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Active Projects</h2>
          <p className="text-3xl font-bold">0</p>
        </div>
        
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Pending Reviews</h2>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-card rounded-lg shadow p-6">
          <p className="text-muted-foreground text-center py-8">
            No recent activity to display
          </p>
        </div>
      </div>
    </div>
  )
}