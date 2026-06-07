'use client'

import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { Calendar as CalendarIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import 'react-day-picker/dist/style.css';

export function DateSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Получаем дату из URL или ставим текущую
    const dateParam = searchParams.get('date');
    const [selectedDate, setSelectedDate] = useState<Date>(
        dateParam ? parseISO(dateParam) : new Date()
    );

    // Синхронизация состояния при изменении URL (например, при нажатии "назад" в браузере)
    useEffect(() => {
        if (dateParam) {
            setSelectedDate(parseISO(dateParam));
        }
    }, [dateParam]);

    const handleSelect = (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date);
            const formattedDate = format(date, 'yyyy-MM-dd');
            
            const params = new URLSearchParams(searchParams.toString());
            params.set('date', formattedDate);
            router.replace(`?${params.toString()}`, { scroll: false });
        }
    };

    return (
        <Popover className="relative">
            <PopoverButton className="
                cursor-pointer
                flex items-center justify-between
                bg-white border border-gray-200 
                rounded-2xl px-6 py-4 
                text-lg font-medium text-gray-900 
                shadow-sm hover:bg-gray-50 
                transition-all focus:outline-none focus:ring-4 focus:ring-brand/10 
                min-w-60 outline-none
            ">
                <span>
                    {format(selectedDate, 'd MMMM yyyy', { locale: ru })}
                </span>
                <CalendarIcon className="ml-2 text-brand" size={24} strokeWidth={2.5} />
            </PopoverButton>

            <Transition
                as={React.Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <PopoverPanel className="cursor-pointer absolute z-50 mt-3 bg-white p-4 rounded-3xl shadow-2xl border border-gray-100 outline-none">
                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleSelect}
                        locale={ru}
                        modifiersStyles={{
                            selected: { 
                                backgroundColor: '#808080',
                                color: 'white',
                                borderRadius: '12px'
                            }
                        }}
                        styles={{
                            caption_label: { color: '#1c1c1c', fontWeight: 'bold' }
                        }}
                    />
                </PopoverPanel>
            </Transition>
        </Popover>
    );
}