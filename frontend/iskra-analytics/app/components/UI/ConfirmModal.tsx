'use client'

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Trash2, X } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message }: ConfirmModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div 
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div 
                className="relative bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-lg transform transition-all animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-8 right-8 text-gray-400 hover:text-brand transition-colors cursor-pointer"
                >
                    <X size={32} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <Trash2 className="w-40 h-40 text-red mb-6" />
                    <h2 className="text-4xl text-brand font-bold mb-4">
                        {title}
                    </h2>                    
                    <p className="text-2xl text-brand font-medium mb-10 leading-relaxed">
                        {message}
                        <span className="block mt-2 text-red/80 text-2xl font-semibold">
                            Это действие нельзя будет отменить.
                        </span>
                    </p>
                    <div className="flex flex-col w-full gap-4">
                        <button 
                            className="text-red font-medium text-2xl cursor-pointer hover:bg-red/80 hover:text-white border px-4 py-2 shadow-md rounded-xl transition-all duration-400 hover:shadow-lg"
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                        >
                            Удалить
                        </button>                        
                        <button 
                            className="text-brand font-medium text-2xl cursor-pointer hover:text-[#41479B] border px-4 py-2 shadow-md hover:border-[#41479B] hover:bg-[#41479B]/40 rounded-xl transition-all duration-200 hover:shadow-lg"
                            onClick={onClose}
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}