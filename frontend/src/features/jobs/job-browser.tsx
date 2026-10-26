import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { SavedJob } from "@/types/jobs";
import type { ScrapedJob } from "@/types/jobs";
import { SOURCE_PLATFORM_NAME } from "@/data/jobs/jobs";
import { JobCard, FREELANCE_SOURCES } from "./components/job-card";
import { BrowserControls } from "./components/browser-controls";
import { CATEGORIES } from "@/data/jobs/jobs";

interface Props {
  onSaveJob: (job: Partial<SavedJob>) => Promise<void>;
  onSaveOffer?: (job: ScrapedJob) => Promise<void>;
}

export function JobBrowser({ onSaveJob, onSaveOffer }: Props) {
  const [category, setCategory] = useState("fullstack");
  const [query, setQuery] = useState("full stack developer");
  const [location, setLocation] = useState("");
  const [days, setDays] = useState(1);
  const [sources, setSources] = useState(["indeed", "wuzzuf", "bayt", "remoteok", "mostaql", "khamsat"]);

  const [results, setResults] = useState<ScrapedJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [fetched, setFetched] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savingOfferId, setSavingOfferId] = useState<string | null>(null);

  const pickCategory = (cat: (typeof CATEGORIES)[number]) => {
    setCategory(cat.id);
    setQuery(cat.query);
  };

  const toggleSource = (id: string) =>
    setSources((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const handleSearch = async () => {
    if (!sources.length) {
      toast.error("Select at least one source.");
      return;
    }
    setLoading(true);
    setFetched(true);
    setErrors([]);
    try {
      const params = new URLSearchParams({
        q: query,
        location,
        days: String(days),
        sources: sources.join(","),
      });
      const r = await fetch(`/api/jobs/scrape?${params}`);
      const data = await r.json();
      setResults(data.jobs ?? []);
      setErrors(data.errors ?? []);
      if ((data.jobs ?? []).length === 0 && (data.errors ?? []).length === sources.length) {
        toast.error("All sources failed. Check your connection or try fewer sources.");
      }
    } catch {
      toast.error("Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (job: ScrapedJob) => {
    setSavingId(job.id);
    try {
      await onSaveJob({
        title: job.title,
        company: job.company,
        location: job.location,
        url: job.url,
        status: "saved",
        platform: SOURCE_PLATFORM_NAME[job.source] ?? job.source,
        remote: job.source === "remoteok" || job.location?.toLowerCase().includes("remote"),
        tags: job.tags ?? [],
        salary: job.salary ?? "",
      });
    } finally {
      setSavingId(null);
    }
  };

  const handleSaveAsOffer = async (job: ScrapedJob) => {
    if (!onSaveOffer) return;
    setSavingOfferId(job.id);
    try {
      await onSaveOffer(job);
    } finally {
      setSavingOfferId(null);
    }
  };

  const linkedInUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}${location ? `&location=${encodeURIComponent(location)}` : ""}&f_TPR=r${days * 86400}`;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <BrowserControls
        category={category}
        query={query}
        location={location}
        days={days}
        sources={sources}
        loading={loading}
        fetched={fetched}
        errors={errors}
        linkedInUrl={linkedInUrl}
        onPickCategory={pickCategory}
        onQueryChange={(q) => { setQuery(q); setCategory(""); }}
        onLocationChange={setLocation}
        onDaysChange={setDays}
        onToggleSource={toggleSource}
        onSearch={handleSearch}
      />

      <div className="flex-1 overflow-y-auto p-4">
        {!fetched && (
          <div className="flex items-center justify-center h-full">
            <EmptyState
              icon={Search}
              title="Browse Jobs from Top Sites"
              description="Search across Indeed, Wuzzuf, Bayt, RemoteOK, Mostaql, and Khamsat at once."
              action={{ label: "Load Jobs Now", onClick: handleSearch }}
              size="lg"
            />
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            <span className="text-sm">Searching {sources.join(", ")}…</span>
          </div>
        )}

        {!loading && fetched && results.length === 0 && (
          <EmptyState
            title="No jobs found"
            description="Try different keywords, a wider time range, or more sources."
            size="sm"
          />
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-2.5">
            <p className="text-[11px] text-muted-foreground">
              {results.length} job{results.length !== 1 ? "s" : ""} found
              {errors.length > 0 && (
                <span className="ml-1 text-yellow-400/80">({errors.join(", ")} unavailable)</span>
              )}
            </p>
            {results.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                savingId={savingId}
                savingOfferId={savingOfferId}
                hasOfferSave={!!onSaveOffer}
                onSave={handleSave}
                onSaveAsOffer={handleSaveAsOffer}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
