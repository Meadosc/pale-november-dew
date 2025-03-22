import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_URL =
    process.env.NODE_ENV === "production"
        ? "https://ebb-and-flow.fly.dev"
        : "http://localhost:8000";

export default function AIPlotSummary({ book_title }: { book_title: string }) {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchSummary = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/summary`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ book_title }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch summary");
            }

            const result = await response.json();
            setSummary(result.data);
        } catch (err) {
            setError("Error generating summary. Please try again.");
            console.error("Summary fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-4">
            <h2 className="font-bold text-lg mt-4 mb-2">AI Plot Summary</h2>
            <Button onClick={fetchSummary} disabled={loading}>
                {loading && <Loader2 className="animate-spin mr-2" />}
                Get a Plot Summary
            </Button>
            {loading && <p className="text-gray-500 mt-2">Generating summary...</p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {summary && (
                <div className="mt-4 bg-gray-100 p-2 rounded-md max-h-96 overflow-auto">
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
}
