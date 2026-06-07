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
        'Admin': 'Администратор',
        'Coach': 'Тренер',
        'User': 'Пользователь',
    } as Record<string, string>,

    sorts: {
        '': '',
    } as Record<string, string>,
};

export const UNIT_TO_NUM_MAP: Record<string, number> = {
    'Seconds': 1,
    'Minutes': 2,
    'Centimeters': 3,
    'Kilograms': 4,
    'Percentage': 5,
    'Count': 6,
    'Meters': 7,
    'KmPerHour': 8,
    'MetersPerSecond': 9,
    'Points': 10
};

export const NUM_TO_UNIT_MAP: Record<number, string> = {
    1: 'Seconds',
    2: 'Minutes',
    3: 'Centimeters',
    4: 'Kilograms',
    5: 'Percentage',
    6: 'Count',
    7: 'Meters',
    8: 'KmPerHour',
    9: 'MetersPerSecond',
    10: 'Points'
};

export const t = (category: keyof typeof TRANSLATIONS, key: string | number) => {
    if (key === undefined || key === null) return '';

    let lookupKey = key.toString();

    if (category === 'units') {
        const numericId = Number(key);
        if (!isNaN(numericId) && NUM_TO_UNIT_MAP[numericId]) {
            lookupKey = NUM_TO_UNIT_MAP[numericId];
        }
    }

    return TRANSLATIONS[category][lookupKey] || key;
};