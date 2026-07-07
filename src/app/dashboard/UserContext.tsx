"use client";

import { createContext, useContext } from "react";
import type { Role } from "../../lib/roles";

export interface DashUser {
  email: string;
  role: Role;
  name?: string;
}

const DashboardUserContext = createContext<DashUser>({
  email: "",
  role: "Member",
});

export function DashboardUserProvider({
  user,
  children,
}: {
  user: DashUser;
  children: React.ReactNode;
}) {
  return (
    <DashboardUserContext.Provider value={user}>
      {children}
    </DashboardUserContext.Provider>
  );
}

export function useDashboardUser(): DashUser {
  return useContext(DashboardUserContext);
}
