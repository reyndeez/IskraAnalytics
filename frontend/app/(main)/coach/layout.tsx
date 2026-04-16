import Navbar from "@/app/components/UI/navbar";

export default function CoachLayout({ children } : any) {
    return (
        <>
        <Navbar />
        {children}
        </>
    );
}