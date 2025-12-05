
import UserHeader from "@/app/components/UserHeader";
import "../globals.css";
import BottomNav from "../components/BottomNav";

export default function UserLayout({ children }) {
    return (
        <>
        <div className="min-h-screen flex flex-col bg-gray-100">
            <UserHeader />

            <main className="flex-1 p-4 pb-24">
                {children}
                  <BottomNav />
            </main>
        </div>
        </>
    );
}
