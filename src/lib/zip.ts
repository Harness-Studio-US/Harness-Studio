/**
 * A small ZIP writer: no dependency, no compression.
 *
 * Project files are a few KB of text, so storing them uncompressed costs
 * nothing and keeps the work to one pass. Entries are flagged UTF-8 so file
 * names with accents survive the round trip.
 */

const encoder = new TextEncoder();

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let value = i;
    for (let bit = 0; bit < 8; bit++) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[i] = value >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let index = 0; index < bytes.length; index++) {
    crc = crcTable[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/** MS-DOS date and time, which is what a ZIP header stores. */
function dosStamp(when: Date): { time: number; date: number } {
  return {
    time:
      ((when.getHours() << 11) | (when.getMinutes() << 5) | (when.getSeconds() >> 1)) & 0xffff,
    date: (((when.getFullYear() - 1980) << 9) | ((when.getMonth() + 1) << 5) | when.getDate()) &
      0xffff,
  };
}

function u16(value: number): Uint8Array {
  return new Uint8Array([value & 0xff, (value >>> 8) & 0xff]);
}

function u32(value: number): Uint8Array {
  return new Uint8Array([
    value & 0xff,
    (value >>> 8) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 24) & 0xff,
  ]);
}

function concat(chunks: Uint8Array[]): Uint8Array {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

export function buildZip(files: { name: string; text: string }[], when = new Date()): Blob {
  const stamp = dosStamp(when);
  const locals: Uint8Array[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const name = encoder.encode(file.name);
    const data = encoder.encode(file.text);
    const crc = crc32(data);

    const local = concat([
      u32(0x04034b50), // local file header
      u16(20), // version needed
      u16(0x0800), // UTF-8 names
      u16(0), // stored, not deflated
      u16(stamp.time),
      u16(stamp.date),
      u32(crc),
      u32(data.length), // compressed size
      u32(data.length), // uncompressed size
      u16(name.length),
      u16(0), // extra field length
      name,
      data,
    ]);
    locals.push(local);

    centrals.push(
      concat([
        u32(0x02014b50), // central directory header
        u16(20), // version made by
        u16(20), // version needed
        u16(0x0800),
        u16(0),
        u16(stamp.time),
        u16(stamp.date),
        u32(crc),
        u32(data.length),
        u32(data.length),
        u16(name.length),
        u16(0), // extra
        u16(0), // comment
        u16(0), // disk number
        u16(0), // internal attributes
        u32(0), // external attributes
        u32(offset), // where this file's local header starts
        name,
      ])
    );

    offset += local.length;
  }

  const central = concat(centrals);
  const end = concat([
    u32(0x06054b50), // end of central directory
    u16(0),
    u16(0),
    u16(files.length),
    u16(files.length),
    u32(central.length),
    u32(offset),
    u16(0), // no archive comment
  ]);

  return new Blob([...locals, central, end] as BlobPart[], { type: "application/zip" });
}

/** Saves every file as one archive the user can unzip anywhere. */
export function downloadZip(
  files: { name: string; text: string }[],
  archiveName = "harness-project.zip"
): void {
  const url = URL.createObjectURL(buildZip(files));
  const link = document.createElement("a");
  link.href = url;
  link.download = archiveName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}
