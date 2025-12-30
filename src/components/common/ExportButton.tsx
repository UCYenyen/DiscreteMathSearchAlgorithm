"use client";

import { useState } from "react";
import { exportToGoogleSheets } from "@/lib/server/action";
import { Button } from "@/components/ui/button";
import { Loader2, FileSpreadsheet } from "lucide-react";

export default function ExportButton() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await exportToGoogleSheets();
      if (res.success) {
        alert("Berhasil ekspor ke Google Sheets!");
      }
    } catch (err) {
      alert("Error: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleExport} 
      disabled={loading}
      className="bg-green-600 hover:bg-green-700 text-white gap-2"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileSpreadsheet className="h-4 w-4" />
      )}
      {loading ? "Exporting..." : "Export to Google Sheets"}
    </Button>
  );
}