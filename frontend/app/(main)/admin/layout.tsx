// /app/admin/layout.tsx

import AdminSidebar from "@/app/components/UI/AdminSidebar";

export default function AdminLayout({ children } : any) {
    return (
        <div className="flex">
        <AdminSidebar />
        <main className="ml-80 w-full px-10 py-10 bg-gray-50 min-h-screen">{children}</main>
        </div>
    );
}