"use client"

import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function ResponsiveEventChart() {
  // Sample data with three dimensions of people quantities across different dates
  const eventData = [
    { date: "2023-01-15", jovens: 120, adultos: 150, criancas: 200 },
    { date: "2023-02-15", jovens: 145, adultos: 180, criancas: 200 },
    { date: "2023-03-15", jovens: 165, adultos: 190, criancas: 200 },
    { date: "2023-04-15", jovens: 190, adultos: 210, criancas: 250 },
    { date: "2023-05-15", jovens: 210, adultos: 230, criancas: 250 },
    { date: "2023-06-15", jovens: 180, adultos: 200, criancas: 250 },
  ]

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("default", { month: "short", day: "numeric" })
  }

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Quantidade de pessoas nos ultimos cultos por faixa etária</h2>
      <div className="w-full">
        <ChartContainer
          config={{
            jovens: {
              label: "Jovens",
              color: "#22c55e", // Green color
            },
            adultos: {
              label: "Adultos",
              color: "#3b82f6", // Blue color
            },
            criancas: {
              label: "Crianças",
              color: "#f97316", // Orange color
            },
          }}
          className="aspect-[4/3] sm:aspect-[16/9] min-h-[300px] w-full"
        >
          <LineChart
            data={eventData}
            margin={{
              top: 20,
              right: 10,
              left: 10,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={formatDate}
              fontSize={12}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={10} fontSize={12} tickCount={5} />
            <ChartTooltip content={<ChartTooltipContent indicator="line" formatter={(value) => `${value} people`} />} />
            <Line
              type="monotone"
              dataKey="jovens"
              stroke="#22c55e" // Green color
              strokeWidth={2}
              dot={{
                r: 4,
                fill: "#22c55e", // Green color
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              type="monotone"
              dataKey="adultos"
              stroke="#3b82f6" // Blue color
              strokeWidth={2}
              dot={{
                r: 4,
                fill: "#3b82f6", // Blue color
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              type="monotone"
              dataKey="criancas"
              stroke="#f97316" // Orange color
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{
                r: 4,
                fill: "#f97316", // Orange color
              }}
              activeDot={{
                r: 6,
              }}
            />
             <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={10}
              wrapperStyle={{ paddingTop: "10px" }}
              formatter={(value) => <span className="text-sm font-medium">{value}</span>}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  )
}

