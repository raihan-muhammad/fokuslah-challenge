"use client";

import React from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

interface MathRendererProps {
  content: string;
  block?: boolean;
}

/**
 * MathRenderer component
 * Renders LaTeX math expressions using KaTeX
 * Supports both inline ($...$) and block ($$...$$) math
 */
export default function MathRenderer({
  content,
  block = false,
}: MathRendererProps) {
  // Split content by math delimiters
  const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g);

  return (
    <div className="math-content">
      {parts.map((part, index) => {
        // Block math ($$...$$)
        if (part.startsWith("$$") && part.endsWith("$$")) {
          const latex = part.slice(2, -2).trim();
          return (
            <div key={index} className="my-4">
              <BlockMath math={latex} />
            </div>
          );
        }

        // Inline math ($...$)
        if (part.startsWith("$") && part.endsWith("$")) {
          const latex = part.slice(1, -1).trim();
          return (
            <span key={index} className="inline-block mx-1">
              <InlineMath math={latex} />
            </span>
          );
        }

        // Regular text
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
}
