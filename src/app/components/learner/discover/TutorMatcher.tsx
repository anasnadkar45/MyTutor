"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { findBestTutorMatch } from "@/app/utils/tutorMatching"
import { toast } from "sonner"
import type { ServiceType } from "@prisma/client"
import { Loader2 } from "lucide-react"

export function TutorMatcher({ learnerId }: { learnerId: string }) {
  const [isMatching, setIsMatching] = useState(false)
  const [matchedTutor, setMatchedTutor] = useState<{ id: string; name: string; service: ServiceType } | null>(null)
  const [desiredService, setDesiredService] = useState("")

  const handleMatch = async () => {
    if (!desiredService.trim()) {
      toast.error("Please enter a desired service")
      return
    }

    setIsMatching(true)
    try {
      const result = await findBestTutorMatch(learnerId, desiredService)
      if (result) {
        setMatchedTutor(result as any)
        toast.success(`Found your best tutor match for ${desiredService}: ${result.name}!`)
      } else {
        toast.error(`No suitable tutor match found for ${desiredService}. Please try a different service.`)
      }
    } catch (error) {
      console.error("Error matching tutor:", error)
      toast.error("Failed to find a tutor match. Please try again.")
    } finally {
      setIsMatching(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mb-8 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Find Your Perfect Tutor</CardTitle>
        <CardDescription>Let AI match you with the best tutor for your needs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="desiredService" className="text-sm font-medium">
            What service are you looking for?
          </Label>
          <Input
            id="desiredService"
            placeholder="e.g. Math tutoring, English lessons, etc."
            value={desiredService}
            onChange={(e) => setDesiredService(e.target.value)}
            className="w-full"
          />
        </div>
        <Button onClick={handleMatch} disabled={isMatching} className="w-full">
          {isMatching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Matching...
            </>
          ) : (
            "Find My Best Tutor Match"
          )}
        </Button>
        {matchedTutor && (
          <div className="mt-4 p-4 bg-secondary rounded-md">
            <p className="text-center mb-2">Great news! We've found a perfect tutor for {desiredService}.</p>
            <p className="font-semibold text-center text-lg mb-2">{matchedTutor.name}</p>
            <Button asChild className="w-full">
              <a href={`/learner/discover/${matchedTutor.service}`}>View the service</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

