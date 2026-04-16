'use client'

import React from 'react';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  ChevronLeft, 
  MoreVertical, 
  Trash2, 
  GraduationCap 
} from 'lucide-react';
import Link from 'next/link';

// Временные данные для наброска
const groupData = {
  id: "1",
  name: "Младшая группа «Снежинки»",
  coach: "Александр Морозов",
  level: "Начинающие",
  schedule: "Пн, Ср, Пт — 14:00",
  studentsCount: 12,
  students: [
    { id: 1, name: "Иванов Максим", age: 7, status: "Active" },
    { id: 2, name: "Петрова Анна", age: 6, status: "Active" },
    { id: 3, name: "Сидоров Артем", age: 8, status: "Warning" }, // Например, пропуски
  ]
};

export default function GroupPage() {
  return (
    <div className="space-y-8">
      {/* Шапка с хлебными крошками */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link 
            href="/admin/groups" 
            className="flex items-center gap-2 text-gray-500 hover:text-[#064592] transition-colors mb-2"
          >
            <ChevronLeft size={20} />
            <span>Назад к списку групп</span>
          </Link>
          <h1 className="text-4xl font-black text-gray-900">{groupData.name}</h1>
        </div>
        
        <button className="flex items-center gap-2 bg-[#064592] text-white px-6 py-3 rounded-2xl hover:bg-[#053a7a] transition-all shadow-lg font-medium">
          <UserPlus size={20} />
          Добавить студента
        </button>
      </div>

      {/* Карточки с инфо */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard 
          icon={<Users className="text-blue-600" />} 
          label="Тренер" 
          value={groupData.coach} 
        />
        <InfoCard 
          icon={<Calendar className="text-purple-600" />} 
          label="Расписание" 
          value={groupData.schedule} 
        />
        <InfoCard 
          icon={<GraduationCap className="text-orange-600" />} 
          label="Уровень" 
          value={groupData.level} 
        />
      </div>

      {/* Таблица студентов */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Список состава</h2>
          <span className="bg-blue-50 text-[#064592] px-4 py-1 rounded-full text-sm font-semibold">
            Всего: {groupData.studentsCount}
          </span>
        </div>
        
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-sm font-semibold">
            <tr>
              <th className="px-8 py-4">Имя студента</th>
              <th className="px-8 py-4">Возраст</th>
              <th className="px-8 py-4">Статус</th>
              <th className="px-8 py-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {groupData.students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-5 font-medium text-gray-900">{student.name}</td>
                <td className="px-8 py-5 text-gray-600">{student.age} лет</td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {student.status === 'Active' ? 'АКТИВЕН' : 'ВНИМАНИЕ'}
                  </span>
                </td>
                <td className="px-8 py-5 text-right space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 size={20} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Вспомогательный компонент для карточек
function InfoCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
      <div className="p-3 bg-gray-50 rounded-2xl">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400 font-medium">{label}</p>
        <p className="text-lg font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}