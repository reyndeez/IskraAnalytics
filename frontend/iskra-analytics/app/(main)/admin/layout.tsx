import AdminSidebar from "@/app/components/UI/AdminSidebar";

export default function AdminLayout({ children } : any) {
    return (
        <div className="flex">
            <AdminSidebar />
            <main className="flex-1 w-full pt-24 px-4 py-6 md:px-10 lg:ml-80 lg:pt-20 lg:px-20">
                {children}
            </main>
        </div>
    );
}