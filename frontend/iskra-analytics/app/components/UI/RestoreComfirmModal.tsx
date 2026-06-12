'use client'

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, RotateCcw } from "lucide-react";

interface RestoreConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    itemName: string;
}

export function RestoreConfirmModal({ isOpen, onClose, onConfirm, title, itemName }: RestoreConfirmModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div 
            className="fixed inset-0 z-120 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
            onClick={onClose}
        >
            <div 
                className="relative bg-white w-full max-w-md rounded-3xl sm:rounded-4xl shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Кнопка закрытия */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1"
                >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Иконка восстановления */}
                <div className="bg-brand/10 p-4 sm:p-5 rounded-2xl sm:rounded-3xl text-brand mb-4 sm:mb-6 mt-2">
                    <RotateCcw className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>

                {/* Текст */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 pr-4 pl-4">{title}</h3>
                <p className="text-gray-500 text-base sm:text-lg mb-6 sm:mb-8 wrap-break-word w-full">
                    Вы уверены, что хотите восстановить <span className="font-semibold text-gray-800">«{itemName}»</span> из архива?
                </p>

                {/* Кнопки действий */}
                <div className="w-full flex flex-col gap-2 sm:gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="w-full bg-brand text-white py-3 sm:py-4 rounded-xl font-bold text-lg sm:text-xl cursor-pointer hover:brightness-110 transition-all shadow-md"
                    >
                        Восстановить
                    </button>
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="w-full text-gray-400 text-base sm:text-lg font-medium py-2.5 sm:py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Отмена
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}