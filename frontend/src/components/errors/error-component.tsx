import { useRouter } from "@tanstack/react-router";
import { RefreshCw, Home, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const errorMessage = error instanceof Error ? error.message : undefined;
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRetry = () => {
    router.invalidate();
    reset();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 size-64 bg-destructive/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 size-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
      </div>

      <div className="relative max-w-lg w-full text-center">
        {/* Animated error icon */}
        <div
          className={`transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          }`}
        >
          <div className="relative inline-block">
            <div className="size-20 md:size-24 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto ring-1 ring-destructive/20 shadow-lg">
              <AlertCircle className="size-10 md:size-12 text-destructive animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 size-3 bg-destructive rounded-full animate-ping" />
          </div>
        </div>

        {/* Animated content */}
        <div
          className={`mt-8 space-y-3 transition-all duration-1000 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            This page didn't load
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-md mx-auto">
            Something went wrong on our end. You can try refreshing or head back home.
          </p>
        </div>

        {/* Error details */}
        {errorMessage && (
          <div
            className={`mt-6 transition-all duration-1000 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <details className="text-left max-w-md mx-auto">
              <summary className="text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/60">
                Error details
              </summary>
              <div className="mt-2 text-xs text-muted-foreground bg-muted/60 rounded-xl px-3 py-2.5 font-mono border border-border/60 max-h-32 overflow-y-auto scrollbar-thin">
                {errorMessage}
              </div>
            </details>
          </div>
        )}

        {/* Animated buttons */}
        <div
          className={`mt-8 flex flex-wrap justify-center gap-3 transition-all duration-1000 delay-400 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <button
            onClick={handleRetry}
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
          >
            <RefreshCw className="size-4 transition-transform group-hover:rotate-180 duration-500" />
            Try again
          </button>
          <a
            href="/"
            className="group inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-accent hover:scale-105 hover:shadow-lg"
          >
            <Home className="size-4 transition-transform group-hover:-translate-y-0.5" />
            Go home
          </a>
        </div>

        {/* Floating particles */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 size-2 bg-destructive/40 rounded-full animate-bounce [animation-delay:0ms] animation-duration-[3s]" />
          <div className="absolute top-1/3 right-1/3 size-1.5 bg-orange-500/40 rounded-full animate-bounce [animation-delay:500ms] animation-duration-[2.5s]" />
          <div className="absolute bottom-1/3 left-1/3 size-2 bg-destructive/30 rounded-full animate-bounce [animation-delay:1000ms] animation-duration-[3.5s]" />
          <div className="absolute bottom-1/4 right-1/4 size-1.5 bg-orange-500/30 rounded-full animate-bounce [animation-delay:1500ms] animation-duration-[2.8s]" />
        </div>
      </div>
    </div>
  );
}
