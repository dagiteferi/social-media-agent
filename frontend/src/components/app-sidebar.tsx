import { NavLink } from "react-router-dom"
import { BarChart3, FileText, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Posts", href: "/", icon: FileText },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
]

export function AppSidebar() {
  return (
    <div className="flex h-full flex-col gap-y-5 border-r bg-card px-6 py-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold">ESMA</h1>
          <p className="text-xs text-muted-foreground">Social Agent</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )
              }
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
