import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// Switched to a light-friendly code theme
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="prose max-w-none text-black leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="text-2xl font-black mt-6 mb-4 border-b border-slate-200 pb-2 text-black"
              {...props}
            />
          ),

          h2: ({ node, ...props }) => (
            <h2
              className="text-xl font-bold mt-5 mb-3 text-teal-700"
              {...props}
            />
          ),

          h3: ({ node, ...props }) => (
            <h3
              className="text-lg font-bold mt-4 mb-2 text-teal-600"
              {...props}
            />
          ),

          p: ({ node, ...props }) => (
            <p
              className="mb-3 text-black leading-relaxed font-normal"
              {...props}
            />
          ),

          a: ({ node, ...props }) => (
            <a
              className="text-teal-600 hover:text-teal-800 underline font-medium transition"
              target="_blank"
              rel="noreferrer"
              {...props}
            />
          ),

          ul: ({ node, ...props }) => (
            <ul
              className="list-disc pl-5 mb-4 space-y-1.5 text-black"
              {...props}
            />
          ),

          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal pl-5 mb-4 space-y-1.5 text-black"
              {...props}
            />
          ),

          li: ({ node, ...props }) => (
            <li className="leading-relaxed" {...props} />
          ),

          strong: ({ node, ...props }) => (
            <strong className="font-bold text-black" {...props} />
          ),

          em: ({ node, ...props }) => (
            <em className="italic text-slate-700" {...props} />
          ),

          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-teal-500 pl-4 py-1 my-4 bg-slate-50 rounded-r italic text-slate-800"
              {...props}
            />
          ),

          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4 shadow-sm border border-slate-200 rounded-lg">
              <table
                className="min-w-full divide-y divide-slate-200"
                {...props}
              />
            </div>
          ),

          th: ({ node, ...props }) => (
            <th
              className="px-4 py-2 bg-slate-50 text-left text-xs font-bold text-black uppercase tracking-wider border-b border-slate-200"
              {...props}
            />
          ),

          td: ({ node, ...props }) => (
            <td
              className="px-4 py-2 text-sm text-black border-b border-slate-100"
              {...props}
            />
          ),

          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");

            return !inline && match ? (
              <div className="my-5 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <SyntaxHighlighter
                  style={oneLight}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    padding: "1.25rem",
                    fontSize: "0.875rem",
                    backgroundColor: "#f8fafc",
                  }}
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code
                className="bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded font-mono text-[0.85em] font-bold border border-teal-100"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
