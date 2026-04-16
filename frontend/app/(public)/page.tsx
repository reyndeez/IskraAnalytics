'use client'

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function Home() {

  const[authMode, setAuthMode] = useState<'login' | 'register' | null>(null);

  return (
    <main className=" flex flex-col snap-y snap-proximity  h-screen ">
      {/* Лендинг */}
      <section className="min-h-screen flex items-center justify-start px-[5%] md:px-[10%]">
        <div className="scroll-mt-50 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="md:w-3/5 space-y-12 text-center md:text-left">
          <h1 className="text-6xl md:text-9xl font-black uppercase leading-[0.8] text-white text-stroke drop-shadow-lg pt-10">
            Искра Льда
          </h1>
          <p className="md:text-8xl font-bold text-[#064592]">
            следи за<br />прогрессом,<br />достигай побед!
          </p>
          <p className="text-3xl font-medium text-[#064592] leading-tight">
            Платформа для мониторинга результатов, аналитики и рейтинга воспитанников центра "Искра Льда"
          </p>
          <Link 
          href="/user/progress?addClick=true"
          className="text-[#064592] font-medium text-2xl cursor-pointer hover:text-[#41479B] border px-4 py-2 shadow-md hover:border-[#41479B] rounded-xl transition-all duration-200 hover:shadow-lg">
            У меня есть код
            </Link>
        </div>
        <div className="md:w-2/5 flex justify-center md:justify-end relative">
          <div className="absolute inset-0 bg-blue-400/30 blur-3xl rounded-full -z-10"/>
          <Image src="/hockey-player.png" alt="хоккеист" width={900} height={900} priority className="object-contain"/>
          <div className="absolute bottom-[5%] left-[40%] w-[60%] h-[5%] bg-black/20 blur-xl -z-10 rounded-full"/>
        </div>
      </div>
      </section>
      {/* Бенто-сетка */}
      <section className="min-h-screen flex flex-col justify-center py-10 px-[5%] md:px-[10%]">
        <div className="text-center md:text-left mb-16 space-y-3">
          <h2 className="text-8xl font-bold text-[#064592]">
            Возможности платформы
        </h2>
        <p className="text-3xl text-[#064592]/60">
          Всё, что нужно для роста каждого хоккеиста
        </p>
        </div>
        <div className=" grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 md:gap-8">
          {/* Горизонтальная карточка */}
          <div className="md:col-span-2 p-10 bg-white/60 backdrop-blur-md rounded-4xl shadow-lg border border-white/40 flex flex-col md:flex-row items-center gap-8 hover:shadow-2xl  hover:border-blue-200 transition-all duration-200">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#064592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-column-big-icon lucide-chart-column-big w-8 h-auto"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><rect x="15" y="5" width="4" height="12" rx="1"/><rect x="7" y="8" width="4" height="9" rx="1"/></svg>
              <h3 className="text-3xl font-bold text-[#064592] ">
                  Мониторинг прогресса
              </h3>
            </div>
              <p className="text-2xl text-[#064592]">
                Отслеживайте динамику физической подготовки, навыков катания и владения клюшкой. Всё в наглядных графиках и таблицах.
              </p>
            </div>
          </div>
          {/* Вертикальная карточка */}
          <div className="p-10 bg-white/60 backdrop-blur-md rounded-4xl shadow-lg border border-white/40 flex flex-col items-center gap-6 hover:shadow-2xl  hover:border-blue-200 transition-all duration-200">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#064592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trophy-icon lucide-trophy w-8 h-auto"><path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978"/><path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978"/><path d="M18 9h1.5a1 1 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"/><path d="M6 9H4.5a1 1 0 0 1 0-5H6"/></svg>
                <h3 className="text-3xl font-bold text-[#064592] ">
                    Рейтинг и топы
                </h3>
              </div>
            <p className="text-2xl text-[#064592]">
              Автоматическая формировка анонимных рейтингов по разным критериям: сила броска, скорость, полезность в игре.
            </p>
          </div>
        </div>
          {/* Вертикальная карточка */}
          <div className="p-10 bg-white/60 backdrop-blur-md rounded-4xl shadow-lg border border-white/40 flex flex-col items-center gap-6 hover:shadow-2xl  hover:border-blue-200 transition-all duration-200">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#064592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-icon lucide-calendar w-8 h-auto"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                <h3 className="text-3xl font-bold text-[#064592] ">
                    Календарь событий
                </h3>
              </div>
            <p className="text-2xl text-[#064592]">
              Все тренировки, матчи и сборы в одном месте
            </p>
          </div>
        </div>
        {/* Горизонтальная карточка */}
          <div className="md:col-span-2 p-10 bg-white/60 backdrop-blur-md rounded-4xl shadow-lg border border-white/40 flex flex-col md:flex-row items-center gap-8 hover:shadow-2xl  hover:border-blue-200 transition-all duration-200">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#064592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain-circuit-icon lucide-brain-circuit w-8 h-auto"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a4.5 4.5 0 0 0 3-4"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M12 13h4"/><path d="M12 18h6a2 2 0 0 1 2 2v1"/><path d="M12 8h8"/><path d="M16 8V5a2 2 0 0 1 2-2"/><circle cx="16" cy="13" r=".5"/><circle cx="18" cy="3" r=".5"/><circle cx="20" cy="21" r=".5"/><circle cx="20" cy="8" r=".5"/></svg>
              <h3 className="text-3xl font-bold text-[#064592] ">
                  AI-рекомендации
              </h3>
            </div>
              <p className="text-2xl text-[#064592]">
                Приложение автоматически анализирует слабые места в статистике и предлагает персональные упражнения для их улучшения.
              </p>
            </div>
          </div>
        </div>    
      </section>
      {/* Подвал */}
      {/* <footer className="bg-[#064592] text-white py-12 px-[5%] md:px-[10%]">
        <div className="flex flex-row  items-center gap-6">
          <Image 
          src="/logo.png"
          alt="Искра Льда"
          width={130}
          height={86}
          className="object-contain brightness-0 invert"
          />
          <p className="text-blue-200 text-sm">
              © 2026 Центр «Искра Льда». Все права защищены.
            </p>
        </div>
      </footer> */}
    </main>    
  );
}
