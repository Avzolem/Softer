import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";

export default async function LayoutAdminPrivate({ children }) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="p-4">
          <MobileHeader />
          {children}
        </div>
      </div>
      <Sidebar />
    </div>
  );
}