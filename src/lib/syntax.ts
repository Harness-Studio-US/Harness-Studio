/**
 * A cheap syntax sanity check for the files the model hands back.
 *
 * A 4-bit 4B model can end a generation on a corrupted token — a closing tag
 * spelled "</ulling>", or a tag that never closes. The browser cannot compile
 * the file, but it can catch the one shape that costs the most time: JSX tags
 * that do not match up.
 *
 * This is a warning, never a verdict. Two things it deliberately ignores are
 * TypeScript generics (`useState<Plan>`, told apart by the identifier before the
 * `<`) and the insides of strings, because a false alarm on working code costs
 * more than a missed typo.
 */

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const MARKUP_LANGS = new Set(["tsx", "jsx", "html"]);

/** Blanks out quoted text and comments while keeping every offset in place. */
function blankNonCode(code: string): string {
  const chars = [...code];
  let index = 0;

  while (index < chars.length) {
    const char = chars[index];
    const next = chars[index + 1];

    if (char === "/" && next === "/") {
      while (index < chars.length && chars[index] !== "\n") chars[index++] = " ";
      continue;
    }
    if (char === "/" && next === "*") {
      chars[index++] = " ";
      chars[index++] = " ";
      while (index < chars.length && !(chars[index] === "*" && chars[index + 1] === "/")) {
        if (chars[index] !== "\n") chars[index] = " ";
        index++;
      }
      if (index < chars.length) {
        chars[index++] = " ";
        chars[index++] = " ";
      }
      continue;
    }
    // Single quotes are left alone: an apostrophe in JSX text is far more common
    // than a string holding a <tag>.
    if (char === '"' || char === "`") {
      index++;
      while (index < chars.length && chars[index] !== char) {
        if (chars[index] === "\\") {
          chars[index++] = " ";
        }
        if (index < chars.length && chars[index] !== "\n") chars[index] = " ";
        index++;
      }
      index++;
      continue;
    }
    index++;
  }

  return chars.join("");
}

/**
 * The first mismatched or unclosed tag, worded so it makes sense to someone
 * reading the file, or null when the tags line up.
 */
export function findSyntaxIssue(lang: string, code: string): string | null {
  if (!MARKUP_LANGS.has(lang.toLowerCase())) return null;

  const source = blankNonCode(code);
  const tag = /<(\/?)([A-Za-z][\w.:-]*)/g;
  const stack: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = tag.exec(source)) !== null) {
    const closing = match[1] === "/";
    const name = match[2];

    if (!closing) {
      // `useState<Plan>` and `a<b` are not tags: an identifier sits right before the `<`.
      const before = match.index > 0 ? source[match.index - 1] : "";
      if (/[\w$.\]]/.test(before)) continue;
    }

    const end = source.indexOf(">", tag.lastIndex);
    if (end === -1) return `\`<${name}\` never closes with \`>\`.`;
    const selfClosing = source.slice(tag.lastIndex, end).trimEnd().endsWith("/");

    if (closing) {
      if (stack.length === 0) return `\`</${name}>\` has no opening tag before it.`;
      const open = stack.pop()!;
      if (open !== name) {
        return `\`<${open}>\` is closed by \`</${name}>\` — those tags do not match.`;
      }
      continue;
    }

    if (selfClosing || VOID_TAGS.has(name.toLowerCase())) continue;
    stack.push(name);
  }

  if (stack.length > 0) return `\`<${stack[stack.length - 1]}>\` is never closed.`;
  return null;
}
