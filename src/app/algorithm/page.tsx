import SearchInterface from "@/components/common/SearchInterface";
import { getUniformData } from "@/lib/uniform";

export default async function Page() {
  const initialData = await getUniformData("ONETHOUSAND");
  const data = Array.isArray(initialData) ? initialData : [];

  return (
    <main className="min-h-screen bg-zinc-900 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-white mb-8">Data Searching Lab</h1>
      <SearchInterface initialData={data} />
    </main>
  );
}