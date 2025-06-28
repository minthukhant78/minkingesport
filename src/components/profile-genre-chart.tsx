
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

interface GenreChartProps {
  data: {
    genre: string;
    games: number;
  }[];
}

const chartConfig = {
  games: {
    label: "Games Reviewed",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function ProfileGenreChart({ data }: GenreChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Genre Breakdown</CardTitle>
        <CardDescription>Number of games reviewed per genre</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <BarChart accessibilityLayer data={data} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="genre"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis allowDecimals={false} />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="games" fill="var(--color-games)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
