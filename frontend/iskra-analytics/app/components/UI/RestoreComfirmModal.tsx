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
            className="fixed inset-0 z-120 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="relative bg-white w-full max-w-md rounded-4xl shadow-2xl p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Кнопка закрытия */}
                <button 
                    onClick={onClose} 
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                    <X size={24} />
                </button>

                {/* Иконка восстановления */}
                <div className="bg-brand/10 p-5 rounded-3xl text-brand mb-6 mt-2">
                    <RotateCcw size={40} />
                </div>

                {/* Текст */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-lg mb-8">
                    Вы уверены, что хотите восстановить <span className="font-semibold text-gray-800">«{itemName}»</span> из архива?
                </p>

                {/* Кнопки действий */}
                <div className="w-full flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="w-full bg-brand text-white py-4 rounded-xl font-bold text-xl cursor-pointer hover:brightness-110 transition-all shadow-lg shadow-brand/20"
                    >
                        Восстановить
                    </button>
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="w-full text-gray-400 text-lg font-medium py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Отмена
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}