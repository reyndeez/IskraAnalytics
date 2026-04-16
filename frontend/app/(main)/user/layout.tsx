import Navbar from "@/app/components/UI/navbar";

export default function UserLayout({ children } : any) {
    return (
        <>
        <Navbar />
        {children}
        </>
    );
}