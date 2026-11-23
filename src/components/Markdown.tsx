import { Fragment, type ReactNode } from "react";
import { CodeBlock } from "./CodeBlock";

type Block =
  | { kind: "code"; lang: string; filename?: string; code: string }
  | { kind: "heading"; level: 1 | 2 | 3; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "quote"; text: string };

function parseBlocks(content: string): Block[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trimStart().startsWith("```")) {
      // ```tsx:PriceCard.tsx hands over a file name as well as a language.
      const [tag, name] = line.trim().slice(3).trim().split(":");
      const lang = tag.trim();
      const filename = name?.trim() || undefined;
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1; // closing fence (or end of stream)
      blocks.push({ kind: "code", lang: lang || "text", filename, code: codeLines.join("\n") });
      continue;
    }

    if (!line.trim()) {
      i += 1;
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      blocks.push({
        kind: "heading",
        level: heading[1].length as 1 | 2 | 3,
        text: heading[2],
      });
      i += 1;
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i += 1;
      }
      blocks.push({ kind: "list", ordered: false, items });
      continue;
    }

    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+[.)]\s+/, ""));
        i += 1;
      }
      blocks.push({ kind: "list", ordered: true, items });
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^\s*>\s?/, ""));
        i += 1;
      }
      blocks.push({ kind: "quote", text: quote.join(" ") });
      continue;
    }

    const paragraph: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^\s*(#{1,3}\s|[-*]\s|\d+[.)]\s|>)/.test(lines[i]) &&
      !lines[i].trimStart().startsWith("```")
    ) {
      paragraph.push(lines[i].trim());
      i += 1;
    }
    blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

function renderInline(text: string): ReactNode[] {
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\n]+\*|\[[^\]]+\]\([^)]+\))/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null = null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<Fragment key={`t-${key++}`}>{text.slice(lastIndex, match.index)}</Fragment>);
    }
    const token = match[0];
    if (token.startsWith("`")) {
      nodes.push(
        <code key={`c-${key++}`} className="inline">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("**")) {
      nodes.push(<strong key={`b-${key++}`}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("[")) {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      nodes.push(
        <a key={`a-${key++}`} href={link?.[2] ?? "#"} target="_blank" rel="noreferrer">
          {link?.[1] ?? token}
        </a>
      );
    } else {
      nodes.push(<em key={`i-${key++}`}>{token.slice(1, -1)}</em>);
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(<Fragment key={`t-${key++}`}>{text.slice(lastIndex)}</Fragment>);
  }
  return nodes;
}

export function Markdown({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  return (
    <div className="prose-harness">
      {blocks.map((block, index) => {
        switch (block.kind) {
          case "code":
            return (
              <CodeBlock
                key={index}
                code={block.code}
                lang={block.lang}
                filename={block.filename}
                className="my-3 border-slate-800 bg-[#0b1120]"
              />
            );
          case "heading": {
            const Tag = (`h${block.level}` as unknown) as "h1";
            return <Tag key={index}>{renderInline(block.text)}</Tag>;
          }
          case "paragraph":
            return <p key={index}>{renderInline(block.text)}</p>;
          case "list":
            return block.ordered ? (
              <ol key={index}>
                {block.items.map((item, i) => (
                  <li key={i}>{renderInline(item)}</li>
                ))}
              </ol>
            ) : (
              <ul key={index}>
                {block.items.map((item, i) => (
                  <li key={i}>{renderInline(item)}</li>
                ))}
              </ul>
            );
          case "quote":
            return <blockquote key={index}>{renderInline(block.text)}</blockquote>;
          default:
            return null;
        }
      })}
    </div>
  );
}
