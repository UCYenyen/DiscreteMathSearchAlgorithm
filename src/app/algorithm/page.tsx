import SearchInterface from "@/components/common/SearchInterface";
import { getUniformData } from "@/lib/uniform";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  try {
    const initialData = await getUniformData("ONETHOUSAND");
    const data = Array.isArray(initialData) ? initialData : [];

    return (
      <main className="min-h-screen bg-zinc-900 flex flex-col items-center py-10">
        <h1 className="text-4xl font-bold text-white mb-8">Data Searching Lab</h1>
        <SearchInterface initialData={data} />
      </main>
    );
  } catch (error) {
    console.error('Error loading data:', error);
    return (
      <main className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center py-10">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Data Searching Lab</h1>
          <p className="text-red-400">Failed to load initial data. Please try again later.</p>
        </div>
      </main>
    );
  }
}