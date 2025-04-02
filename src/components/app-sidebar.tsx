"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Davi Araujo",
    email: "davi.araujo@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Catedral da Esperança",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Cultos",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Registro de Cultos",
          url: "/cultos",
        },
        {
          title: "Métricas do Culto - Em Desenvolvimento",
          url: "#",
        },
      ],
    },
    {
      title: "Celulas",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Visão Geral",
          url: "#",
        },
        {
          title: "Lista de Celulas",
          url: "#",
        },
        {
          title: "Registro de Celula",
          url: "#",
        },
      ],
    },
    {
      title: "Escola Bíblica",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Turmas",
          url: "#",
        },
        {
          title: "Alunos",
          url: "#",
        },
      ],
    },
    {
      title: "Batismos",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Cadastro de novo batismo",
          url: "#",
        },
        {
          title: "Histórico de batismos",
          url: "#",
        },
        {
          title: "Relatório de batismos",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
