import { FileText, FileWarning, Clock, CheckCircle } from "lucide-react"

export function StatsCards() {
  const stats = [
    {
      label: "Total Documents",
      value: "1,248",
      id: "total",
      icon: FileText,
      color: "text-blue-500",
    },
    {
      label: "Require Extraction",
      value: "342",
      id: "extraction",
      icon: FileWarning,
      color: "text-amber-500",
    },
    {
      label: "Require Review",
      value: "156",
      id: "review",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      label: "Time Saved",
      value: "5d 8h:45m",
      id: "time",
      icon: Clock,
      color: "text-purple-500",
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-4 bg-white p-4 rounded-md shadow-sm">
      {stats.map((stat) => (
        <div key={stat.id} className="flex items-center gap-3">
          <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
            <stat.icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-gray-600 whitespace-nowrap">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

