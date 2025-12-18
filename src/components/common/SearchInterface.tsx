"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { fetchData } from "@/lib/server/action";

interface SearchData {
  id: string;
  nama?: string;
  nim?: string;
  value?: number;
  jurusan?: string;
  alamat?: string;
}

interface SearchStats {
  algo: string;
  timeNs: number;
  count: number;
}

export default function SearchInterface({ initialData }: { initialData: SearchData[] }) {
  const [data, setData] = useState<SearchData[]>(initialData);
  const [dataType, setDataType] = useState<string>("UNIFORM");
  const [quantity, setQuantity] = useState<string>("ONETHOUSAND");
  const [algo, setAlgo] = useState<string>("linear");
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [stats, setStats] = useState<SearchStats | null>(null);
  const [results, setResults] = useState<SearchData[]>(initialData);

  useEffect(() => {
    const updateData = async () => {
      setLoading(true);
      const newData = await fetchData(dataType, quantity);
      const formattedData = Array.isArray(newData) ? (newData as SearchData[]) : [];
      setData(formattedData);
      setResults(formattedData);
      setLoading(false);
    };
    updateData();
  }, [dataType, quantity]);

  const executeSearch = useCallback(() => {
    if (!query) {
      setResults(data);
      setStats(null);
      return;
    }

    const term = query.toLowerCase();
    let searchResults: SearchData[] = [];
    
    // Performa dihitung murni pada proses pencarian
    const start = performance.now();

    if (algo === "linear") {
      searchResults = data.filter((item) => 
        item.nama?.toLowerCase().includes(term) || 
        item.nim?.toLowerCase().includes(term) ||
        item.value?.toString().includes(term)
      );
    } 
    else if (algo === "sequential") {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (
          item.nama?.toLowerCase().includes(term) || 
          item.nim?.toLowerCase().includes(term) ||
          item.value?.toString().includes(term)
        ) {
          searchResults.push(item);
        }
      }
    }
    else if (algo === "interpolation") {
      const target = parseInt(query);
      if (!isNaN(target)) {
        let low = 0;
        let high = data.length - 1;

        // Algoritma berjalan pada dataset "apa adanya" (data), baik urut maupun tidak.
        while (low <= high && target >= parseInt(data[low].nim || data[low].value?.toString() || "0") && target <= parseInt(data[high].nim || data[high].value?.toString() || "0")) {
          const lowVal = parseInt(data[low].nim || data[low].value?.toString() || "0");
          const highVal = parseInt(data[high].nim || data[high].value?.toString() || "0");

          if (low === high) {
            if (lowVal === target) searchResults.push(data[low]);
            break;
          }

          // Rumus: pos = low + [ (target - data[low]) * (high - low) / (data[high] - data[low]) ]
          const pos = low + Math.floor(((target - lowVal) * (high - low)) / (highVal - lowVal));
          
          if (pos < 0 || pos >= data.length) break;

          const posVal = parseInt(data[pos].nim || data[pos].value?.toString() || "0");

          if (posVal === target) {
            searchResults.push(data[pos]);
            break;
          }
          
          if (posVal < target) low = pos + 1;
          else high = pos - 1;
        }
      }
    }

    const end = performance.now();
    const durationNs = Math.max((end - start) * 1_000_000, 0.001);

    setResults(searchResults);
    setStats({ algo, timeNs: durationNs, count: searchResults.length });
    setShowStats(true); 
  }, [query, algo, data]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      executeSearch();
    }
  };

  return (
    <div className="w-full max-w-6xl flex flex-col gap-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-xs text-zinc-400 font-medium">Data Category</label>
          <Select value={dataType} onValueChange={setDataType}>
            <SelectTrigger className="bg-zinc-800 text-white border-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 text-white border-zinc-700">
              <SelectItem value="UNIFORM">Uniform (Sorted Mahasiswa)</SelectItem>
              <SelectItem value="NON_UNIFORM">Non-Uniform</SelectItem> 
              <SelectItem value="UNSORTED">Unsorted/Random</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400 font-medium">Quantity</label>
          <Select value={quantity} onValueChange={setQuantity}>
            <SelectTrigger className="bg-zinc-800 text-white border-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 text-white border-zinc-700">
              <SelectItem value="ONETHOUSAND">1,000 Data</SelectItem> 
              <SelectItem value="FIVETHOUSAND">5,000 Data</SelectItem> 
              <SelectItem value="TENTHOUSAND">10,000 Data</SelectItem> 
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400 font-medium">Algorithm</label>
          <Select value={algo} onValueChange={setAlgo}>
            <SelectTrigger className="bg-zinc-800 text-white border-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 text-white border-zinc-700">
              <SelectItem value="linear">Linear (Filter)</SelectItem>
              <SelectItem value="sequential">Sequential (Manual Loop)</SelectItem>
              <SelectItem value="interpolation">Interpolation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400 font-medium">Search (Press Enter)</label>
          <Input 
            placeholder="Type and press Enter..."
            className="bg-zinc-800 text-white border-zinc-700 focus-visible:ring-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      <div className="relative rounded-xl border border-zinc-700 min-h-[400px] overflow-hidden">
        {loading && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white z-10 font-bold">LOADING DATA...</div>}
        <Table>
          <TableHeader className="bg-zinc-800/50">
            <TableRow className="border-zinc-700">
              <TableHead className="text-zinc-300">ID / NIM</TableHead>
              <TableHead className="text-zinc-300">Name / Value</TableHead>
              <TableHead className="text-zinc-300">Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-zinc-900">
            {results.slice(0, 100).map((item, i) => (
              <TableRow key={item.id || i} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/40 transition-colors">
                <TableCell className="font-mono">{item.nim || item.id}</TableCell>
                <TableCell>{item.nama || item.value}</TableCell>
                <TableCell className="text-zinc-500 text-xs">{item.jurusan || item.alamat || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!loading && results.length === 0 && query && (
          <div className="p-20 text-center text-zinc-500 italic">No results found for your query.</div>
        )}
      </div>

      <Dialog open={showStats} onOpenChange={setShowStats}>
        <DialogContent className="bg-zinc-950 border-zinc-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">Benchmark Results</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-400 text-sm">Algorithm</span>
                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded uppercase font-bold">{stats?.algo}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-400 text-sm">Time</span>
                <span className="text-green-400 font-mono font-bold text-lg">{stats?.timeNs.toLocaleString()} ns</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm">Found</span>
                <span className="font-bold">{stats?.count} items</span>
              </div>
            </div>
            <div className="text-[10px] text-zinc-500 text-center italic">
              Note: Interpolation search may fail if data is not sorted correctly.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}