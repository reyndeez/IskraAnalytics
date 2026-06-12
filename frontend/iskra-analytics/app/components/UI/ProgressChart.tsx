import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ProgressChart = ({data}: {data: any[]}) => {
    return (
        // Адаптивная высота контейнера: на мобильных меньше, на больших экранах стандартная
        <div className="w-full h-64 sm:h-100">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorResult" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#064592" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#064592" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                        dataKey="createdAt" 
                        axisLine={false} 
                        tickLine={false} 
                        // Снижен размер шрифта для лучшей читаемости дат на узких экранах
                        tick={{fill: '#9CA3AF', fontSize: 10}}
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#9CA3AF', fontSize: 10}}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            fontSize: '14px' 
                        }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="value"
                        name='Текущий результат'
                        stroke="#064592" 
                        strokeWidth={3} // На мобильных ультра-толстая линия 4px смотрится грубо, 3px — баланс
                        fillOpacity={1} 
                        fill="url(#colorResult)" 
                    />
                    <Area 
                        type="monotone" 
                        dataKey="avgValue"
                        name='Средний результат' 
                        stroke="#9CA3AF" 
                        strokeWidth={1.5}
                        strokeDasharray="5 5"
                        fill="transparent" 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};