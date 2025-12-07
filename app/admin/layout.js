import AdminTopBar from "@/app/components/AdminTopBar";
import AdminSidebar from "@/app/components/AdminSidebar";
import "@/app/globals.css";

export default function AdminLayout({ children }) {
    return (
        <div className="w-full flex justify-center bg-gray-200 min-h-screen">

            {/* --- MOBILE FRAME (Same as user: 360px) --- */}
            <div className="relative w-full max-w-[360px] min-h-screen bg-white shadow-lg overflow-x-hidden flex">

                {/* Sidebar */}
                <AdminSidebar />

                {/* Main Content */}
                <div className="flex-1">
                    <AdminTopBar />
                    <main className="p-4">{children}</main>
                </div>

            </div>

        </div>
    );
}
