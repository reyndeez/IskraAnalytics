import { MeasurementResponse } from "@/app/models/responses/measurementResponse";
import { useEffect, useState } from "react";

interface TableRowProps {
    res: MeasurementResponse;
    onFocus: (studentId: string) => void;
    onSave: (studentId: string, value: number, resultId: string | null) => Promise<void>;
}

export function TableRow({ res, onFocus, onSave }: TableRowProps) {
    const [inputValue, setInputValue] = useState<number>(res.value);

    useEffect(() => {
        setInputValue(res.value);
    }, [res.value]);

    const firstName = res.student.fullName?.split(' ')[1] || res.student.fullName;
    const lastName = res.student.fullName?.split(' ')[0] || '';

    return (
        <tr className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
            <td className="p-6 text-lg">{firstName}</td>
            <td className="p-6 text-lg">{lastName}</td>
            <td className="p-6">
                <input 
                    type="number"
                    value={inputValue === 0 ? '' : inputValue} 
                    onChange={(e) => setInputValue(Number(e.target.value))}
                    onFocus={() => onFocus(String(res.student.id))}
                    onBlur={() => onSave(String(res.student.id), inputValue, res.student.id)} 
                    className="w-24 p-2 border rounded-lg text-brand font-bold focus:outline-none focus:ring-2 focus:ring-brand"
                    placeholder="0"
                />
            </td>
        </tr>
    );
}