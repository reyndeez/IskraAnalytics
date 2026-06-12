'use client'

import { MeasurementResponse } from "@/app/models/responses/measurementResponse";
import { useEffect, useState } from "react";

interface TableRowProps {
    res: MeasurementResponse;
    onFocus: (studentId: string) => void;
    onSave: (studentId: string, value: number, resultId: string | null) => Promise<void>;
}

export function TableRow({ res, onFocus, onSave }: TableRowProps) {
    // Безопасно инициализируем стейт численной метрики
    const [inputValue, setInputValue] = useState<number>(res.value ?? 0);

    useEffect(() => {
        setInputValue(res.value ?? 0);
    }, [res.value]);

    // Безопасный парсинг имени и фамилии
    const firstName = res.student.fullName?.split(' ')[1] || res.student.fullName || '—';
    const lastName = res.student.fullName?.split(' ')[0] || '';

    const handleBlur = () => {
        // Третьим параметром передаем null, так как в модели нет resultId.
        // Бэкенд сделает upsert по studentId, metricId и дате.
        onSave(String(res.student.id), inputValue, null);
    };

    return (
        <tr className="border-t border-brand/5 hover:bg-brand/2 transition-colors duration-150">
            <td className="p-4 sm:p-5 text-base sm:text-lg font-medium text-brand/80">{firstName}</td>
            <td className="p-4 sm:p-5 text-base sm:text-lg font-medium text-brand/80">{lastName}</td>
            <td className="p-4 sm:p-5 text-right w-30">
                <div className="relative flex items-center justify-end">
                    <input 
                        type="number"
                        inputMode="numeric" 
                        value={inputValue === 0 ? '' : inputValue} 
                        onChange={(e) => {
                            const val = e.target.value;
                            setInputValue(val === '' ? 0 : Number(val));
                        }}
                        onFocus={() => onFocus(String(res.student.id))}
                        onBlur={handleBlur} 
                        className="w-20 sm:w-24 p-2 text-center bg-brand/4 border border-transparent rounded-xl text-brand font-bold text-lg focus:outline-none focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all placeholder:text-brand/30"
                        placeholder="0"
                    />
                </div>
            </td>
        </tr>
    );
}