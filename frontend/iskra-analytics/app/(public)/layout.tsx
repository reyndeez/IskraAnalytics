import Navbar from "@/app/components/UI/navbar";

export default function PublicLayout({ children }: any) {
    return (
        <>
        <Navbar />
        {children}
        </>
    );
}