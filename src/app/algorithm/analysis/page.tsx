import prisma from "@/lib/prisma";
import ExportButton from "@/components/common/ExportButton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const dynamic = 'force-dynamic';

export default async function AnalysisPage() {
    const recentAnalysis = await prisma.analysisResult.findMany({
        orderBy: { startSearchAt: "desc" },
    });

    return (
        <main className="min-h-screen bg-zinc-900 flex w-screen flex-col items-center py-10 gap-8">
            <div className="flex justify-end w-[80%] items-center">
                <ExportButton />
            </div>

            <div className="rounded-xl border border-zinc-700 bg-zinc-900 overflow-hidden w-[80%]">
                <Table>
                    <TableHeader className="bg-zinc-800">
                        <TableRow className="border-zinc-700">
                            <TableHead className="text-zinc-300">Timestamp</TableHead>
                            <TableHead className="text-zinc-300">Algo</TableHead>
                            <TableHead className="text-zinc-300">Dataset</TableHead>
                            <TableHead className="text-zinc-300">Time (ms)</TableHead>
                            <TableHead className="text-zinc-300">Iterasi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentAnalysis.map((item) => (
                            <TableRow key={item.id} className="border-zinc-700 text-zinc-300">
                                <TableCell>{new Date(item.startSearchAt).toLocaleString()}</TableCell>
                                <TableCell className="uppercase font-bold text-blue-400">{item.algorithm}</TableCell>
                                <TableCell>{item.datasetSize}</TableCell>
                                <TableCell>{item.executionTimeMs.toFixed(4)}</TableCell>
                                <TableCell>{item.iterations}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </main>
    );
}