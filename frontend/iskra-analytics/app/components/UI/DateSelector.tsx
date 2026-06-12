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
    
    const dateParam = searchParams.get('date');
    const [selectedDate, setSelectedDate] = useState<Date>(
        dateParam ? parseISO(dateParam) : new Date()
    );

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
                flex items-center justify-between gap-3
                bg-white border border-gray-200 
                rounded-2xl px-3 sm:px-4 py-2 sm:py-3 
                text-base sm:text-xl font-medium text-gray-900 
                shadow-sm hover:bg-gray-50 
                transition-all focus:outline-none focus:ring-4 focus:ring-brand/10 
                min-w-44 sm:min-w-60 outline-none
            ">
                <span className="truncate">
                    {format(selectedDate, 'd MMMM yyyy', { locale: ru })}
                </span>
                <CalendarIcon className="text-brand shrink-0 w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
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
                <PopoverPanel className="cursor-pointer absolute z-50 mt-2 left-0 sm:left-auto bg-white p-2 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 outline-none max-w-[95vw] overflow-x-auto">
                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleSelect}
                        locale={ru}
                        
                        captionLayout="dropdown"
                        
                        startMonth={new Date(2024, 0)}
                        endMonth={new Date(new Date().getFullYear() + 2, 11)}
                        
                        modifiersStyles={{
                            selected: { 
                                backgroundColor: 'var(--color-brand, #111)',
                                color: 'white',
                                borderRadius: '12px'
                            }
                        }}
                        styles={{
                            caption_label: { display: 'none' },
                            dropdown: {
                                cursor: 'pointer',
                                padding: '4px 8px',
                                borderRadius: '8px',
                                border: '1px solid rgba(17, 17, 17, 0.08)',
                                backgroundColor: '#fff',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#1c1c1c',
                                marginRight: '4px',
                                outline: 'none'
                            }
                        }}
                    />
                </PopoverPanel>
            </Transition>
        </Popover>
    );
}