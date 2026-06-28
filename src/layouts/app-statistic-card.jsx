import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, MailOpen, Mail } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getChartData } from "@/services/chartService";

export function StatisticsCards() {
  const [data, setData] = useState({
    suratMasuk: 0,
    suratKeluar: 0,
    suratMasukLalu: 0,
    suratKeluarLalu: 0,
    percent: 0,
    naik: true,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getChartData();
        const suratMasuk = res.surat_masuk_bulan_ini || 0;
        const suratKeluar = res.surat_keluar_bulan_ini || 0;
        const suratMasukLalu = res.surat_masuk_bulan_lalu || 0;
        const suratKeluarLalu = res.surat_keluar_bulan_lalu || 0;

        const totalIni = suratMasuk + suratKeluar;
        const totalLalu = suratMasukLalu + suratKeluarLalu;
        let percent = 0;
        let naik = true;
        if (totalLalu > 0) {
          percent = Math.abs(((totalIni - totalLalu) / totalLalu) * 100);
          naik = totalIni >= totalLalu;
        }
        setData({
          suratMasuk,
          suratKeluar,
          suratMasukLalu,
          suratKeluarLalu,
          percent: percent.toFixed(1),
          naik,
        });
      } catch {
        setData({
          suratMasuk: 0,
          suratKeluar: 0,
          suratMasukLalu: 0,
          suratKeluarLalu: 0,
          percent: 0,
          naik: true,
        });
      }
    }
    fetchData();
  }, []);

  // Format tanggal DD/MM/YYYY
  const today = new Date();
  const formattedDate = today
    .toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "/");

  // Greeting based on time
  const hour = today.getHours();
  let greeting = "Selamat pagi";
  if (hour >= 12 && hour < 18) {
    greeting = "Selamat siang";
  } else if (hour >= 18 || hour < 4) {
    greeting = "Selamat malam";
  }

  return (
    <div className="flex flex-col gap-10">
       {/* Greeting Card */}
      <Card className="flex flex-col bg-white rounded-lg w-[400px] h-[194px] justify-between shadow-0">
       <CardContent className="flex flex-row items-center h-full py-8">
          {/* Kiri: Greeting & Date */}
          <div className="flex flex-col flex-1 justify-center">
            <div className="text-xl font-semibold mb-2">{greeting}</div>
            <div className="text-sm text-gray-700">{formattedDate}</div>
          </div>
          {/* Kanan: Gambar */}
          <div className="flex items-center justify-center h-full">
            <img
              src="/img/greetcard.png"
              alt="Greeting"
              className="w-[200px] h-[180px] object-contain"
              draggable={false}
            />
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between px-4 py-2">
          
        </CardFooter>
      </Card>
      {/* Surat Masuk */}
      <Card className="flex flex-col bg-white rounded-lg w-[400px] h-full justify-between shadow-0">
        <CardContent className="flex items-center pt-1">
          <div>
            <MailOpen className="w-[100px] h-[80px] stroke-[0.5px]" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-600">Surat Masuk</h2>
            <p className="text-3xl font-semibold text-gray-900">{data.suratMasuk}</p>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between px-4 py-2">
          <div className={data.naik ? "text-green-600" : "text-red-600"}>
            <p className="text-sm font-medium">
              {data.suratMasukLalu === 0
                ? "Belum ada data bulan lalu"
                : data.naik
                ? <>+{data.percent}% <TrendingUp className="inline h-4 w-4" /></>
                : <>-{data.percent}% <TrendingDown className="inline h-4 w-4" /></>
              }
            </p>
          </div>
          <p className="text-sm text-gray-500">Dibanding bulan lalu</p>
        </CardFooter>
      </Card>
      {/* Surat Keluar */}
      <Card className="flex flex-col bg-white rounded-lg w-[400px] h-full justify-between shadow-0">
        <CardContent className="flex items-center pt-1">
          <div>
            <Mail className="w-[100px] h-[80px] stroke-[0.5px]" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-600">Surat Keluar</h2>
            <p className="text-3xl font-semibold text-gray-900">{data.suratKeluar}</p>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between px-4 py-2">
          <div className={data.naik ? "text-green-600" : "text-red-600"}>
            <p className="text-sm font-medium">
              {data.suratKeluarLalu === 0
                ? "Belum ada data bulan lalu"
                : data.naik
                ? <>+{data.percent}% <TrendingUp className="inline h-4 w-4" /></>
                : <>-{data.percent}% <TrendingDown className="inline h-4 w-4" /></>
              }
            </p>
          </div>
          <p className="text-sm text-gray-500">Dibanding bulan lalu</p>
        </CardFooter>
      </Card>

    </div>
  );
}

