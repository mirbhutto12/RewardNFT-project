import { Gift, Award, Users, Disc } from "lucide-react"

interface Activity {
  id: number
  type: string
  title: string
  date: string
  description: string
}

interface ActivityItemProps {
  activity: Activity
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const getIcon = () => {
    switch (activity.type) {
      case "mint":
        return <Disc className="text-theme-cyan" />
      case "reward":
        return <Gift className="text-theme-yellow" />
      case "referral":
        return <Users className="text-theme-pink" />
      default:
        return <Award className="text-white" />
    }
  }

  return (
    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
      <div className="flex items-start gap-4">
        <div className="bg-white/10 rounded-full p-2">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-white">{activity.title}</h3>
            <span className="text-white/60 text-sm">{new Date(activity.date).toLocaleDateString()}</span>
          </div>
          <p className="text-white/80 mt-1">{activity.description}</p>
        </div>
      </div>
    </div>
  )
}
