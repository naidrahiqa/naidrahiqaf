import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:font-mono prose-headings:tracking-tight prose-headings:text-foreground prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-[15px] prose-p:leading-relaxed prose-p:text-muted prose-strong:text-foreground prose-li:text-muted prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-blockquote:border-accent prose-blockquote:text-muted prose-code:text-accent prose-pre:bg-surface prose-pre:border prose-pre:border-border prose-pre:rounded-xl">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
