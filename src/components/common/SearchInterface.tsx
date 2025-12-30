"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchData, saveAnalysisResult } from "@/lib/server/action";

interface SearchData {
  id: string;
  nama: string;
  nim: string;
  jurusan: string;
  alamat: string;
}

export default function SearchInterface({ initialData }: { initialData: SearchData[] }) {
  const [data, setData] = useState<SearchData[]>(initialData);
  const [dataType, setDataType] = useState<string>("UNIFORM");
  const [quantity, setQuantity] = useState<string>("ONETHOUSAND");
  const [algo, setAlgo] = useState<string>("linear");
  const [searchField, setSearchField] = useState<string>("nim");
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [stats, setStats] = useState<any>(null);
  const [results, setResults] = useState<SearchData[]>(initialData);
  
  const isFetching = useRef(false);

  useEffect(() => {
    const updateData = async () => {
      if (isFetching.current) return;
      isFetching.current = true;
      setLoading(true);
      try {
        const newData = await fetchData(dataType, quantity);
        const formattedData = Array.isArray(newData) ? (newData as SearchData[]) : [];
        setData(formattedData);
        setResults(formattedData);
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    };
    updateData();
  }, [dataType, quantity]);

  const stringToNumeric = (str: string) => {
    const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);
    let num = 0;
    for (let i = 0; i < cleanStr.length; i++) {
      num = num * 31 + cleanStr.charCodeAt(i);
    }
    return num;
  };

  const executeSearch = useCallback(async () => {
    if (!query || data.length === 0 || loading) return;

    const term = query.toLowerCase();
    let searchResults: SearchData[] = [];
    let iterations = 0;
    
    let currentData = [...data];
    if (algo !== "linear") {
      currentData.sort((a, b) => {
        const valA = (a[searchField as keyof SearchData] || "").toString().toLowerCase();
        const valB = (b[searchField as keyof SearchData] || "").toString().toLowerCase();
        return valA.localeCompare(valB);
      });
    }

    const startTimestamp = new Date();
    const startPerf = performance.now();

    if (algo === "linear") {
      for (let i = 0; i < currentData.length; i++) {
        iterations++;
        const val = (currentData[i][searchField as keyof SearchData] || "").toString().toLowerCase();
        if (val.includes(term)) searchResults.push(currentData[i]);
      }
    } 
    else if (algo === "binary") {
      let low = 0, high = currentData.length - 1;
      while (low <= high) {
        iterations++;
        const mid = Math.floor((low + high) / 2);
        const midVal = (currentData[mid][searchField as keyof SearchData] || "").toString().toLowerCase();
        
        if (midVal.includes(term)) {
          let l = mid;
          while (l >= 0 && (currentData[l][searchField as keyof SearchData] || "").toString().toLowerCase().includes(term)) {
            searchResults.unshift(currentData[l--]);
            iterations++;
          }
          let r = mid + 1;
          while (r < currentData.length && (currentData[r][searchField as keyof SearchData] || "").toString().toLowerCase().includes(term)) {
            searchResults.push(currentData[r++]);
            iterations++;
          }
          break;
        }
        if (midVal < term) low = mid + 1; else high = mid - 1;
      }
    }
    else if (algo === "interpolation") {
      let low = 0, high = currentData.length - 1;
      const targetNum = stringToNumeric(term);

      while (low <= high) {
        iterations++;
        const lowStr = (currentData[low][searchField as keyof SearchData] || "").toString().toLowerCase();
        const highStr = (currentData[high][searchField as keyof SearchData] || "").toString().toLowerCase();
        const lowNum = stringToNumeric(lowStr), highNum = stringToNumeric(highStr);

        if (targetNum < lowNum || targetNum > highNum) break;
        let pos = lowNum === highNum ? low : low + Math.floor(((targetNum - lowNum) * (high - low)) / (highNum - lowNum));
        if (pos < low || pos > high) break;

        const posStr = (currentData[pos][searchField as keyof SearchData] || "").toString().toLowerCase();
        if (posStr.includes(term)) {
          let l = pos;
          while (l >= 0 && (currentData[l][searchField as keyof SearchData] || "").toString().toLowerCase().includes(term)) {
            searchResults.unshift(currentData[l--]);
            iterations++;
          }
          let r = pos + 1;
          while (r < currentData.length && (currentData[r][searchField as keyof SearchData] || "").toString().toLowerCase().includes(term)) {
            searchResults.push(currentData[r++]);
            iterations++;
          }
          break;
        }
        if (stringToNumeric(posStr) < targetNum) low = pos + 1; else high = pos - 1;
      }
    }

    const endPerf = performance.now();
    const durationNs = (endPerf - startPerf) * 1_000_000;

    setResults(searchResults);
    setStats({ algo, timeNs: durationNs, count: searchResults.length, iterations });
    
    setTimeout(() => {
      setShowStats(true);
    }, 50);

    try {
      await saveAnalysisResult({
        iterations,
        itemsFound: searchResults.length,
        executionTimeMs: durationNs / 1_000_000,
        startSearchAt: startTimestamp,
        endSearchAt: new Date(),
        datatype: dataType,
        algorithm: algo,
        datasetSize: quantity,
        fieldToSearch: searchField,
        searchValue: query
      });
    } catch (err) {
      console.error(err);
    }
  }, [query, algo, data, dataType, quantity, searchField, loading]);

  return (
    <div className="w-full max-w-6xl flex flex-col gap-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Select value={dataType} onValueChange={setDataType}>
          <SelectTrigger className="bg-zinc-800 text-white border-zinc-700"><SelectValue placeholder="Data"/></SelectTrigger>
          <SelectContent className="bg-zinc-800 text-white border-zinc-700">
            <SelectItem value="UNIFORM">Uniform</SelectItem>
            <SelectItem value="NONUNIFORM">Non-Uniform</SelectItem> 
            <SelectItem value="UNSORTED">Unsorted</SelectItem>
          </SelectContent>
        </Select>

        <Select value={quantity} onValueChange={setQuantity}>
          <SelectTrigger className="bg-zinc-800 text-white border-zinc-700"><SelectValue placeholder="Size"/></SelectTrigger>
          <SelectContent className="bg-zinc-800 text-white border-zinc-700">
            <SelectItem value="ONETHOUSAND">1,000</SelectItem> 
            <SelectItem value="FIVETHOUSAND">5,000</SelectItem> 
            <SelectItem value="TENTHOUSAND">10,000</SelectItem> 
          </SelectContent>
        </Select>

        <Select value={algo} onValueChange={setAlgo}>
          <SelectTrigger className="bg-zinc-800 text-white border-zinc-700"><SelectValue placeholder="Algo"/></SelectTrigger>
          <SelectContent className="bg-zinc-800 text-white border-zinc-700">
            <SelectItem value="linear">Linear</SelectItem>
            <SelectItem value="binary">Binary</SelectItem>
            <SelectItem value="interpolation">Interpolation</SelectItem>
          </SelectContent>
        </Select>

        <Select value={searchField} onValueChange={setSearchField}>
          <SelectTrigger className="bg-zinc-800 text-white border-zinc-700"><SelectValue placeholder="Field"/></SelectTrigger>
          <SelectContent className="bg-zinc-800 text-white border-zinc-700">
            <SelectItem value="nim">NIM</SelectItem>
            <SelectItem value="nama">Nama</SelectItem>
            <SelectItem value="jurusan">Jurusan</SelectItem>
            <SelectItem value="alamat">Alamat</SelectItem>
          </SelectContent>
        </Select>

        <Input 
          className="bg-zinc-800 text-white border-zinc-700" 
          placeholder="Search..." 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
        />
      </div>

      <div className="relative rounded-xl border border-zinc-700 min-h-[400px] overflow-hidden bg-zinc-900">
        {loading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white z-10 font-bold uppercase tracking-widest">Loading Data...</div>}
        <Table>
          <TableHeader className="bg-zinc-800/50">
            <TableRow className="border-zinc-700">
              <TableHead className="text-zinc-300">NIM</TableHead>
              <TableHead className="text-zinc-300">Nama</TableHead>
              <TableHead className="text-zinc-300">Jurusan</TableHead>
              <TableHead className="text-zinc-300">Alamat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.slice(0, 100).map((item, i) => (
              <TableRow key={item.id || `row-${i}`} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/40">
                <TableCell className="font-mono">{item.nim}</TableCell>
                <TableCell>{item.nama}</TableCell>
                <TableCell>{item.jurusan}</TableCell>
                <TableCell className="text-zinc-500">{item.alamat}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showStats} onOpenChange={setShowStats}>
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()} className="bg-zinc-950 border-zinc-700 text-white max-w-sm">
          <DialogHeader><DialogTitle className="text-center">Analisis Selesai</DialogTitle></DialogHeader>
          <div className="mt-4 space-y-3 bg-zinc-900 p-4 rounded-lg border border-zinc-800">
            <div className="flex justify-between text-sm"><span>Algoritma</span><span className="font-bold text-blue-400 uppercase">{stats?.algo}</span></div>
            <div className="flex justify-between text-sm"><span>Waktu</span><span className="font-mono text-green-400">{stats?.timeNs?.toLocaleString()} ns</span></div>
            <div className="flex justify-between text-sm"><span>Iterasi</span><span className="font-mono text-yellow-400">{stats?.iterations?.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span>Ditemukan</span><span className="font-bold">{stats?.count}</span></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}