import AdminTopBar from "@/app/components/AdminTopBar";
import "@/app/globals.css";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-200 overflow-x-hidden">

      <div className="relative flex w-full min-h-screen bg-white">
        <AdminSidebar />

        <div className="flex-1 min-w-0">
          <AdminTopBar />
          <main className="p-4 max-w-full overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>

    </div>
  );
}
