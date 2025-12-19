"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  iterations: number;
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

  const stringToNumeric = (str: string) => {
    const s = str.toLowerCase().slice(0, 4);
    let num = 0;
    for (let i = 0; i < s.length; i++) {
      num = num * 256 + s.charCodeAt(i);
    }
    return num;
  };

  const executeSearch = useCallback(() => {
    if (!query || data.length === 0) {
      setResults(data);
      setStats(null);
      return;
    }

    const term = query.toLowerCase();
    const isNumeric = !isNaN(Number(query));
    let searchResults: SearchData[] = [];
    let iterations = 0;
    
    let currentData = [...data];
    if (algo !== "linear") {
      currentData.sort((a, b) => {
        if (!isNumeric) {
          return (a.nama || "").toLowerCase().localeCompare((b.nama || "").toLowerCase());
        }
        const valA = parseInt(a.nim || a.value?.toString() || "0");
        const valB = parseInt(b.nim || b.value?.toString() || "0");
        return valA - valB;
      });
    }

    const start = performance.now();

    if (algo === "linear") {
      for (let i = 0; i < currentData.length; i++) {
        iterations++;
        const item = currentData[i];
        if (
          item.nama?.toLowerCase().includes(term) || 
          item.nim?.toLowerCase().includes(term) ||
          item.value?.toString().includes(term)
        ) {
          searchResults.push(item);
        }
      }
    } 
    else if (algo === "binary") {
      let low = 0;
      let high = currentData.length - 1;

      while (low <= high) {
        iterations++;
        const mid = Math.floor((low + high) / 2);
        const midItem = currentData[mid];
        
        if (isNumeric) {
          const midVal = parseInt(midItem.nim || midItem.value?.toString() || "0");
          const target = parseInt(query);
          if (midVal === target) {
            searchResults.push(midItem);
            break;
          }
          if (midVal < target) low = mid + 1;
          else high = mid - 1;
        } else {
          const midName = (midItem.nama || "").toLowerCase();
          if (midName.startsWith(term)) {
            let left = mid;
            while (left >= 0 && (currentData[left].nama || "").toLowerCase().startsWith(term)) {
              searchResults.unshift(currentData[left]);
              left--;
              iterations++;
            }
            let right = mid + 1;
            while (right < currentData.length && (currentData[right].nama || "").toLowerCase().startsWith(term)) {
              searchResults.push(currentData[right]);
              right++;
              iterations++;
            }
            break;
          }
          if (midName < term) low = mid + 1;
          else high = mid - 1;
        }
      }
    }
    else if (algo === "interpolation") {
      let low = 0;
      let high = currentData.length - 1;

      while (low <= high) {
        iterations++;
        let lowVal: number, highVal: number, targetVal: number;

        if (isNumeric) {
          lowVal = parseInt(currentData[low].nim || currentData[low].value?.toString() || "0");
          highVal = parseInt(currentData[high].nim || currentData[high].value?.toString() || "0");
          targetVal = parseInt(query);
        } else {
          lowVal = stringToNumeric(currentData[low].nama || "");
          highVal = stringToNumeric(currentData[high].nama || "");
          targetVal = stringToNumeric(query);
        }

        if (targetVal < lowVal || targetVal > highVal) break;

        let pos = lowVal === highVal ? low : low + Math.floor(((targetVal - lowVal) * (high - low)) / (highVal - lowVal));
        if (pos < low || pos > high) break;

        const posItem = currentData[pos];
        const posName = (posItem.nama || "").toLowerCase();
        const posValNum = isNumeric ? parseInt(posItem.nim || posItem.value?.toString() || "0") : 0;

        if (isNumeric ? posValNum === targetVal : posName.startsWith(term)) {
          if (!isNumeric) {
            let left = pos;
            while (left >= 0 && (currentData[left].nama || "").toLowerCase().startsWith(term)) {
              if (!searchResults.includes(currentData[left])) searchResults.unshift(currentData[left]);
              left--;
              iterations++;
            }
            let right = pos + 1;
            while (right < currentData.length && (currentData[right].nama || "").toLowerCase().startsWith(term)) {
              if (!searchResults.includes(currentData[right])) searchResults.push(currentData[right]);
              right++;
              iterations++;
            }
          } else {
            searchResults.push(posItem);
          }
          break;
        }

        if (isNumeric ? posValNum < targetVal : posName < term) low = pos + 1;
        else high = pos - 1;
      }
    }

    const end = performance.now();
    const durationNs = Math.max((end - start) * 1_000_000, 0.001);

    setResults(searchResults);
    setStats({ algo, timeNs: durationNs, count: searchResults.length, iterations });
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
              <SelectItem value="UNIFORM">Uniform (Mahasiswa)</SelectItem>
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
              <SelectItem value="linear">Linear Search</SelectItem>
              <SelectItem value="binary">Binary Search</SelectItem>
              <SelectItem value="interpolation">Interpolation Search</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400 font-medium">Search (Enter)</label>
          <Input 
            placeholder="Search name or NIM..."
            className="bg-zinc-800 text-white border-zinc-700"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      <div className="relative rounded-xl border border-zinc-700 min-h-[400px] overflow-hidden bg-zinc-900">
        {loading && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white z-10 font-bold">LOADING...</div>}
        <Table>
          <TableHeader className="bg-zinc-800/50">
            <TableRow className="border-zinc-700 hover:bg-transparent">
              <TableHead className="text-zinc-300">ID / NIM</TableHead>
              <TableHead className="text-zinc-300">Name / Value</TableHead>
              <TableHead className="text-zinc-300">Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.slice(0, 100).map((item, i) => (
              <TableRow key={item.id || i} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/40">
                <TableCell className="font-mono">{item.nim || item.id}</TableCell>
                <TableCell>{item.nama || item.value}</TableCell>
                <TableCell className="text-zinc-500 text-xs">{item.jurusan || item.alamat || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showStats} onOpenChange={setShowStats}>
        <DialogContent className="bg-zinc-950 border-zinc-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Benchmark Statistics</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-3 bg-zinc-900 p-4 rounded-lg border border-zinc-800">
            <div className="flex justify-between text-sm"><span className="text-zinc-400">Algorithm</span><span className="font-bold text-blue-400 uppercase">{stats?.algo}</span></div>
            <div className="flex justify-between text-sm"><span className="text-zinc-400">Execution Time</span><span className="font-mono text-green-400 font-bold">{stats?.timeNs.toLocaleString()} ns</span></div>
            <div className="flex justify-between text-sm"><span className="text-zinc-400">Iterations</span><span className="font-mono text-yellow-400 font-bold">{stats?.iterations.toLocaleString()} steps</span></div>
            <div className="flex justify-between text-sm"><span className="text-zinc-400">Items Found</span><span className="font-bold">{stats?.count} items</span></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}