import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  BarChart3,
  Settings,
  UserCheck,
  Phone,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    title: "Leads",
    icon: Users,
    children: [
      {
        title: "All Leads",
        href: "/leads",
      },
      {
        title: "Enquiries",
        href: "/leads/enquiries",
      },
      {
        title: "Prospects",
        href: "/leads/prospects",
      },
      {
        title: "Customers",
        href: "/leads/customers",
      },
    ],
  },

  {
    title: "Activities",
    icon: ClipboardList,
    children: [
      {
        title: "Calls",
        href: "/activities/calls",
      },
      {
        title: "Follow Ups",
        href: "/activities/followups",
      },
      {
        title: "Site Visits",
        href: "/activities/site-visits",
      },
    ],
  },

  {
    title: "Projects",
    href: "/projects",
    icon: Building2,
  },

  {
    title: "Relationship Managers",
    href: "/team",
    icon: UserCheck,
  },

  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
  },

  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];