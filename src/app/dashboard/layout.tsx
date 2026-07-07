import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { DashboardUserProvider } from "./UserContext";
import { getSession } from "../../lib/session-server";
import { normalizeRole } from "../../lib/roles";

// Admin area — keep it out of search indexes.
export const metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware guarantees a valid session here; decode it for role-aware UI.
  const session = await getSession();
  const user = {
    email: (session?.email as string) ?? "",
    name: session?.name as string | undefined,
    role: normalizeRole(session?.role as string | undefined),
  };

  return (
    <DashboardUserProvider user={user}>
      <div className="dash-bg min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex flex-1 flex-col min-w-0">
            <Topbar />
            <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </div>
    </DashboardUserProvider>
  );
}
