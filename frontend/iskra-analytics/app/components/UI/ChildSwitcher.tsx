'use client'
import { useRouter, useSearchParams } from 'next/navigation';

interface Child {
    id: number | string;
    firstName: string;
}

interface ChildSwitcherProps {
    childrenList: Child[];
}

export default function ChildSwitcher({ childrenList }: ChildSwitcherProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // 1. Получаем ID из URL
    const urlStudentId = searchParams.get('studentId');
    
    // 2. Вычисляем активный ID с учетом дефолтных значений
    let activeId = urlStudentId;
    
    if (!activeId && childrenList.length > 0) {
        const savedStudentId = localStorage.getItem('selectedStudentId');
        // Если в localStorage сохранен корректный ID, берем его
        if (savedStudentId && childrenList.some(c => c.id.toString() === savedStudentId)) {
            activeId = savedStudentId;
        } else {
            // Иначе выделяем первого ребенка из списка
            activeId = childrenList[0].id.toString();
        }
    }

    const handleSelect = (id: number | string) => {
        localStorage.setItem('selectedStudentId', id.toString());

        const params = new URLSearchParams(searchParams.toString());
        params.set('studentId', id.toString());
        params.delete('addClick');
        
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    if (childrenList.length === 0) return null;

    return (
        <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md p-2 rounded-full shadow-inner border border-white">
            {childrenList.map((child: Child) => {
                // Проверяем совпадение с вычисленным activeId
                const isSelected = activeId === child.id.toString();
                
                return (
                    <button
                        key={child.id}
                        title={child.firstName}
                        onClick={() => handleSelect(child.id)}
                        className={`cursor-pointer w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300
                            ${isSelected 
                                ? 'bg-brand ring-4 ring-blue-100 scale-105 shadow-md' 
                                : 'bg-slate-300 hover:bg-slate-400'}`}
                    >
                        {child.firstName[0].toUpperCase()}
                    </button>
                );
            })}
            
            <button 
                onClick={() => router.push('?addClick=true')} 
                className="cursor-pointer w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-brand hover:text-brand transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="M12 5v14"/>
                </svg>
            </button>
        </div>
    );
}