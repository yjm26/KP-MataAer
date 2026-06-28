import React, { useEffect, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getChartData } from "@/services/chartService"; // import chartService.js

const chartConfig = {
  desktop: {
    label: "Surat",
    color: "#77A8EC",
  },
};

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function AppChart() {
  const [chartData, setChartData] = useState([
    { surat: "Masuk", desktop: 0 },
    { surat: "Keluar", desktop: 0 },
  ]);
  const [stats, setStats] = useState({
    percent: 0,
    naik: true,
    bulanIni: 0,
    bulanLalu: 0,
  });

  const now = new Date();
  const bulanIni = monthNames[now.getMonth()];

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getChartData();
        
        setChartData([
          { surat: "Masuk", desktop: data.surat_masuk_bulan_ini || 0 },
          { surat: "Keluar", desktop: data.surat_keluar_bulan_ini || 0 },
        ]);
        // Hitung total surat bulan ini & bulan lalu
        const totalIni =
          (data.surat_masuk_bulan_ini || 0) + (data.surat_keluar_bulan_ini || 0);
        const totalLalu =
          (data.surat_masuk_bulan_lalu || 0) + (data.surat_keluar_bulan_lalu || 0);
        let percent = 0;
        let naik = true;
        if (totalLalu > 0) {
          percent = Math.abs(((totalIni - totalLalu) / totalLalu) * 100);
          naik = totalIni >= totalLalu;
        }
        setStats({
          percent: percent.toFixed(1),
          naik,
          bulanIni: totalIni,
          bulanLalu: totalLalu,
        });
      } catch {
        setChartData([
          { surat: "Masuk", desktop: 0 },
          { surat: "Keluar", desktop: 0 },
        ]);
        setStats({
          percent: 0,
          naik: true,
          bulanIni: 0,
          bulanLalu: 0,
        });
      }
    }
    fetchData();
  }, []);

  return (
    <Card className="w-[800px] mx-auto h-full p-4">
      <CardHeader>
        <CardTitle>Recap Surat</CardTitle>
        <CardDescription>{bulanIni}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            width={500}
            height={300}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="surat"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4}>
              <LabelList
                position="top"
                offset={8}
                className="fill-foreground"
                fontSize={10}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {stats.bulanLalu === 0

            ? "Belum ada data bulan lalu"
            : stats.naik
            ? ( <>Lebih banyak ${stats.percent}% dari bulan kemarin <TrendingUp className="h-4 w-4" /> </> )
            : ( <>Lebih sedikit ${stats.percent}% dari bulan kemarin <TrendingDown className="h-4 w-4" /> </> )
            
            }
          
        </div>
        <div className="leading-none text-muted-foreground">
          <p>Menampilkan surat selama periode bulan {bulanIni}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
