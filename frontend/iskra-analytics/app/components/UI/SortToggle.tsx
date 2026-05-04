import { ArrowDownNarrowWide, ArrowDownWideNarrow } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function SortToggle(){
    const router = useRouter();
    const searchParams = useSearchParams();

    const order = searchParams.get('order') || 'asc';

    const toggleOrder = () => {
        const params = new URLSearchParams(searchParams.toString());

        const newOrder = order === 'asc' ? 'desc' : 'asc';
        params.set('order', newOrder);

        params.set('page', '1');

        router.replace(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div
            onClick={toggleOrder}
            className="p-2 bg-white rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition"
        >
            {order === 'asc' ? (
                <ArrowDownNarrowWide className="w-9 h-9 text-brand" />
            ) : (
                <ArrowDownWideNarrow className="w-9 h-9 text-brand" />
            )}
        </div>
    );
}