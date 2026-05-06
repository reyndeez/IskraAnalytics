import { ArrowDownNarrowWide, ArrowDownWideNarrow } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function SortToggle(){
    const router = useRouter();
    const searchParams = useSearchParams();

    const isDesc = searchParams.get('isDescending') === 'true';

    const toggleOrder = () => {
        const params = new URLSearchParams(searchParams.toString());

        params.set('isDescending', (!isDesc).toString());
        params.set('page', '1');

        router.replace(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div
            onClick={toggleOrder}
            className="p-2 bg-white rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition"
        >
            {isDesc === true ? (
                <ArrowDownNarrowWide className="w-9 h-9 text-brand" />
            ) : (
                <ArrowDownWideNarrow className="w-9 h-9 text-brand" />
            )}
        </div>
    );
}