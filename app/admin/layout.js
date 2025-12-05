import AdminTopBar from "@/app/components/AdminTopBar";
import AdminSidebar from "@/app/components/AdminSidebar";
import "@/app/globals.css";

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100 flex">

            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1">
                <AdminTopBar />
                <main className="p-4">{children}</main>
            </div>

        </div>
    );
}
