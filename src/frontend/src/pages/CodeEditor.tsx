import { ExternalLink, Monitor } from "lucide-react";

// ─── CodeEditor Component ─────────────────────────────────────────────────────
export function CodeEditor() {
  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-sm">
            <Monitor className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">
              Code Practice
            </h1>
            <p className="text-xs text-muted-foreground">
              Run and test your code easily
            </p>
          </div>
        </div>
        <a
          href="https://www.w3schools.com/tryit/tryit.asp"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open in new tab
        </a>
      </div>

      {/* W3Schools TryIt Iframe */}
      <div className="flex-1 min-h-0 relative">
        <iframe
          src="https://www.w3schools.com/tryit/tryit.asp"
          title="W3Schools Code Compiler"
          width="100%"
          className="w-full h-full border-0 block"
          style={{ height: "calc(100vh - 120px)" }}
          allowFullScreen
        />
      </div>

      {/* Footer Note */}
      <div className="shrink-0 flex items-center justify-center py-2 border-t border-border bg-muted/30">
        <span className="text-[11px] text-muted-foreground">
          Powered by{" "}
          <a
            href="https://www.w3schools.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            W3Schools TryIt Editor
          </a>
        </span>
      </div>
    </div>
  );
}
