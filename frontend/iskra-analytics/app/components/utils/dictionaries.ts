// Словари для перевода значений с бэкенда
export const TRANSLATIONS = {
    ampluas: {
        'Goalkeeper': 'Вратарь',
        'Forward': 'Нападающий',
        'Defender': 'Защитник',
    } as Record<string, string>,

    units: {
        'Seconds': 'сек.',
        'Minutes': 'мин.',
        'Centimeters': 'см',
        'Kilograms': 'кг',
        'Percentage': '%',
        'Count': 'раз',
        'Meters': 'м',
        'KmPerHour': 'км/ч',
        'MetersPerSecond': 'м/с',
        'Points': 'очков'
    } as Record<string, string>,

    roles: {
    'Admin':'Администратор',
    'Coach':'Тренер',
    'User':'Пользователь',
    } as Record<string, string>,

    sorts: {
        '':'',
        '':'',
        '':'',
    } as Record<string,string>,
};

export const t = (category: keyof typeof TRANSLATIONS, key: string | number) => {
    return TRANSLATIONS[category][key.toString()] || key;
};