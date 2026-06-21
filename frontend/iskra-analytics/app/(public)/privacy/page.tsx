export default function PrivacyPage() {
    return (
        <div className="p-4 sm:p-8 pt-32 md:pt-48 px-[4%] sm:px-[10%] md:px-[15%] mx-auto w-full max-w-480">

            {/* Заголовок */}
            <div className="mb-10 md:mb-14">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-brand">
                    Политика конфиденциальности
                </h1>
                <p className="text-xl sm:text-2xl md:text-3xl mt-3 font-medium text-brand/60">
                    Обработка и защита персональных данных пользователей
                </p>
            </div>

            {/* Контент */}
            <div className="flex flex-col gap-6 md:gap-8">

                {/* Блок */}
                <section className="p-6 md:p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl shadow-blue-900/5">
                    <h2 className="text-lg md:text-2xl font-extrabold text-brand uppercase tracking-wider mb-3">
                        1. Общие положения
                    </h2>
                    <p className="text-gray-600 text-sm md:text-lg leading-relaxed">
                        Настоящая политика описывает порядок обработки персональных данных пользователей
                        системы. Использование сервиса означает согласие с условиями данной политики.
                    </p>
                </section>

                {/* Данные */}
                <section className="p-6 md:p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl shadow-blue-900/5">
                    <h2 className="text-lg md:text-2xl font-extrabold text-brand uppercase tracking-wider mb-3">
                        2. Собираемые данные
                    </h2>
                    <ul className="list-disc ml-5 text-gray-600 text-sm md:text-lg space-y-1">
                        <li>Адрес электронной почты</li>
                        <li>Имя и фамилия пользователя</li>
                        <li>Данные для авторизации (пароль хранится в хешированном виде)</li>
                    </ul>
                </section>

                {/* Цели */}
                <section className="p-6 md:p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl shadow-blue-900/5">
                    <h2 className="text-lg md:text-2xl font-extrabold text-brand uppercase tracking-wider mb-3">
                        3. Цели обработки данных
                    </h2>
                    <ul className="list-disc ml-5 text-gray-600 text-sm md:text-lg space-y-1">
                        <li>Регистрация и авторизация пользователей</li>
                        <li>Обеспечение работы платформы</li>
                        <li>Поддержка пользовательских аккаунтов</li>
                    </ul>
                </section>

                {/* Хранение */}
                <section className="p-6 md:p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl shadow-blue-900/5">
                    <h2 className="text-lg md:text-2xl font-extrabold text-brand uppercase tracking-wider mb-3">
                        4. Хранение и защита данных
                    </h2>
                    <p className="text-gray-600 text-sm md:text-lg leading-relaxed">
                        Данные хранятся в защищённой базе данных. Доступ к ним ограничен и осуществляется
                        через систему авторизации. Пароли пользователей не хранятся в открытом виде.
                    </p>
                </section>

                {/* Права */}
                <section className="p-6 md:p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl shadow-blue-900/5">
                    <h2 className="text-lg md:text-2xl font-extrabold text-brand uppercase tracking-wider mb-3">
                        5. Права пользователя
                    </h2>
                    <p className="text-gray-600 text-sm md:text-lg leading-relaxed">
                        Пользователь имеет право запросить удаление или изменение своих персональных данных
                        в любое время.
                    </p>
                </section>

                {/* Footer */}
                <div className="text-center text-brand/50 text-sm md:text-base pt-4">
                    Последнее обновление: 2026 год
                </div>

            </div>
        </div>
    );
}