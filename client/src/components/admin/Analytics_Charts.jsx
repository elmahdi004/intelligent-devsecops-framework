import { Legend, BarChart, Bar, Rectangle, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie , Cell, Line, LineChart, CartesianGrid } from 'recharts';

export function Analytic_LineChart({chartData,XDataKey,YDataKey,strokeColor})
{
    return (
        <ResponsiveContainer className='min-h-96' width="100%" height="100%">
            <LineChart  margin={{
                top: 5,
                right: 30,
                bottom: 5,
            }} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={XDataKey} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={YDataKey} stroke={strokeColor} />
            </LineChart>
        </ResponsiveContainer>
    );
}

export function Analytic_BarChart({chartData,XDataKey,YDataKey,fillColor})
{
    return (
        <ResponsiveContainer className='min-h-96' width="100%" height="100%">
            <BarChart  margin={{
                top: 5,
                right: 30,
                bottom: 5,
            }} data={chartData}>
                <XAxis dataKey={XDataKey} />
                <YAxis />
                <Tooltip />
                <Bar dataKey={YDataKey} fill={fillColor} activeBar={<Rectangle fill="#34495E" />}/>
            </BarChart>
        </ResponsiveContainer>
    );
}

export function Analytic_PieChart({chartData,dataKey,nameKey,color})
{
    return (
        <ResponsiveContainer className='min-h-96' width="100%" height="100%">
            <PieChart width={400} height={400}>
                <Pie 
                data={chartData}
                dataKey={dataKey}
                nameKey={nameKey}
                labelLine={false}
                cx="50%" 
                cy="50%"
                label = {
                    ({ cx, cy, midAngle, innerRadius, outerRadius, percent , index}) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      
                        return (
                          <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                            {`${(percent * 100).toFixed(0)}%`}
                          </text>
                        );
                    }
                }
                >
                    {chartData && chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={color[entry[nameKey]]}/>
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}