"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Star } from "lucide-react"

interface ViewCardProps {
  title: string
  description: string
  metadata: string
  onClick: () => void
  variant: "recent" | "suggested"
}

export default function ViewCard({ title, description, metadata, onClick, variant }: ViewCardProps) {
  const getIcon = () => {
    if (variant === "recent") return <Clock className="h-4 w-4" />
    return <Star className="h-4 w-4" />
  }

  const getVariantStyles = () => {
    if (variant === "recent") {
      return "border-blue-200 hover:border-blue-300 hover:shadow-md dark:border-blue-800 dark:hover:border-blue-700"
    }
    return "border-green-200 hover:border-green-300 hover:shadow-md dark:border-green-800 dark:hover:border-green-700"
  }

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${getVariantStyles()}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          {getIcon()}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm mb-3">{description}</p>
        <Badge
          variant="secondary"
          className={
            variant === "recent"
              ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              : "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
          }
        >
          {metadata}
        </Badge>
      </CardContent>
    </Card>
  )
}
