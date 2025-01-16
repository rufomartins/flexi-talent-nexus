import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { SharedView } from "@/components/castings/guest/shared/SharedView";
import Dashboard from "@/pages/dashboard";
import Castings from "@/pages/castings";
import CastingDetails from "@/pages/castings/[id]";
import GuestView from "@/pages/castings/guest/[id]";
import TalentProfiles from "@/pages/talent-profiles";
import TalentProfileDetails from "@/pages/talent-profiles/[id]";
import Settings from "@/pages/settings";
import Clients from "@/pages/clients";
import ClientDetails from "@/pages/clients/[id]";
import Projects from "@/pages/projects";
import ProjectDetails from "@/pages/projects/[id]";
import Users from "@/pages/users";
import UserDetails from "@/pages/users/[id]";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />
      },
      {
        path: "/castings",
        element: <Castings />
      },
      {
        path: "/castings/:id",
        element: <CastingDetails />
      },
      {
        path: "/castings/guest/:id",
        element: <GuestView />
      },
      {
        path: "/talent-profiles",
        element: <TalentProfiles />
      },
      {
        path: "/talent-profiles/:id",
        element: <TalentProfileDetails />
      },
      {
        path: "/settings",
        element: <Settings />
      },
      {
        path: "/clients",
        element: <Clients />
      },
      {
        path: "/clients/:id",
        element: <ClientDetails />
      },
      {
        path: "/projects",
        element: <Projects />
      },
      {
        path: "/projects/:id",
        element: <ProjectDetails />
      },
      {
        path: "/users",
        element: <Users />
      },
      {
        path: "/users/:id",
        element: <UserDetails />
      }
    ]
  },
  {
    path: "/share/:token",
    element: <SharedView token={useParams().token} />
  }
]);