import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ProgressChart = ({data}: {data: any[]}) => {
    return (
        <div className="w-full h-100">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                        tick={{fill: '#9CA3AF', fontSize: 12}}
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#9CA3AF', fontSize: 12}}
                    />
                    <Tooltip 
                        contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="value"
                        name='Текущий результат'
                        stroke="#064592" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorResult)" 
                    />
                    <Area 
                        type="monotone" 
                        dataKey="avgValue"
                        name='Средний результат' 
                        stroke="#9CA3AF" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        fill="transparent" 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};