import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Loader2, ChevronDown } from "lucide-react";

interface Suggestion {
  placeId: string;
  displayName: string;
  shortName: string;
  lat: string;
  lon: string;
}

const BISKRA_VIEWBOX = "4.2,35.3,7.8,33.2";

async function searchBiskra(query: string): Promise<Suggestion[]> {
  if (!query.trim() || query.trim().length < 2) return [];

  const normalizedQuery = query.trim();

  const buildUrl = (q: string) =>
    `https://nominatim.openstreetmap.org/search?` +
    new URLSearchParams({
      q,
      format: "json",
      limit: "6",
      countrycodes: "dz",
      viewbox: BISKRA_VIEWBOX,
      bounded: "1",
      addressdetails: "1",
      "accept-language": "ar,fr",
    }).toString();

  const headers = { "User-Agent": "GostoFood-Biskra/1.0" };

  const queries = [
    fetch(buildUrl(`${normalizedQuery}, بسكرة`), { headers }),
    fetch(buildUrl(`${normalizedQuery}, Biskra`), { headers }),
  ];

  const responses = await Promise.allSettled(queries);
  const seen = new Set<string>();
  const results: Suggestion[] = [];

  for (const res of responses) {
    if (res.status !== "fulfilled") continue;
    let data: any[] = [];
    try {
      data = await res.value.json();
    } catch {
      continue;
    }

    for (const item of data) {
      const id = item.place_id?.toString();
      if (!id || seen.has(id)) continue;
      seen.add(id);

      const addr = item.address ?? {};
      const parts: string[] = [];

      if (addr.road || addr.street) parts.push(addr.road ?? addr.street);
      if (addr.neighbourhood || addr.suburb) parts.push(addr.neighbourhood ?? addr.suburb);
      if (addr.city || addr.town || addr.village || addr.municipality)
        parts.push(addr.city ?? addr.town ?? addr.village ?? addr.municipality);
      if (addr.state) parts.push(addr.state);

      const shortName = parts.length > 0 ? parts.join("، ") : item.display_name?.split(",")[0]?.trim();
      const displayName = item.display_name ?? shortName;

      if (shortName) {
        results.push({
          placeId: id,
          displayName,
          shortName,
          lat: item.lat,
          lon: item.lon,
        });
      }
    }
  }

  return results.slice(0, 5);
}

interface Props {
  value: string;
  onChange: (val: string) => void;
  hasError?: boolean;
}

export default function AddressAutocomplete({ value, onChange, hasError }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback(async (q: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (q.trim().length < 2) { setSuggestions([]); setOpen(false); return; }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchBiskra(q);
        setSuggestions(results);
        setOpen(results.length > 0);
        setActiveIdx(-1);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    search(e.target.value);
  };

  const handleSelect = (s: Suggestion) => {
    onChange(s.shortName);
    setSuggestions([]);
    setOpen(false);
    setActiveIdx(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIdx(-1);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setActiveIdx(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "relative" }}>
        <MapPin
          size={15}
          style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)", pointerEvents: "none" }}
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="مثال: حي الشهداء، بسكرة / Ex: Cité Daksi, Biskra"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
          autoComplete="off"
          dir="auto"
          className="w-full py-3.5 sharp text-sm font-medium text-white placeholder:text-white/15 outline-none transition-all bg-transparent"
          style={{
            paddingLeft: 40,
            paddingRight: loading ? 40 : 16,
            background: "rgba(255,255,255,0.035)",
            border: hasError
              ? "1px solid rgba(255,80,80,0.6)"
              : open
              ? "1px solid rgba(255,122,0,0.5)"
              : "1px solid rgba(255,255,255,0.08)",
            boxShadow: open ? "0 0 20px rgba(255,122,0,0.08)" : "none",
          }}
        />
        {loading && (
          <Loader2
            size={14}
            style={{
              position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
              color: "rgba(255,122,0,0.7)",
              animation: "spin 1s linear infinite",
            }}
          />
        )}
        {!loading && suggestions.length > 0 && (
          <ChevronDown
            size={13}
            style={{
              position: "absolute", right: 14, top: "50%", transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`,
              color: "rgba(255,255,255,0.2)", transition: "transform 0.2s",
            }}
          />
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 1000,
            background: "rgba(12,12,18,0.99)",
            border: "1px solid rgba(255,122,0,0.25)",
            borderRadius: 0,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.8), 0 0 20px rgba(255,122,0,0.06)",
          }}
        >
          <div
            style={{
              padding: "6px 12px 4px",
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            مواقع في ولاية بسكرة / Biskra
          </div>
          {suggestions.map((s, i) => (
            <button
              key={s.placeId}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); handleSelect(s); }}
              onMouseEnter={() => setActiveIdx(i)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                width: "100%",
                padding: "10px 14px",
                textAlign: "right",
                background: i === activeIdx ? "rgba(255,122,0,0.1)" : "transparent",
                border: "none",
                borderBottom: i < suggestions.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                cursor: "pointer",
                transition: "background 0.12s",
              }}
            >
              <MapPin
                size={13}
                style={{ color: i === activeIdx ? "#FF7A00" : "rgba(255,255,255,0.3)", flexShrink: 0, marginTop: 2 }}
              />
              <div style={{ minWidth: 0, textAlign: "right" }}>
                <p
                  dir="auto"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: i === activeIdx ? "#fff" : "rgba(255,255,255,0.75)",
                    margin: 0,
                    lineHeight: 1.3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.shortName}
                </p>
                <p
                  dir="auto"
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.3)",
                    margin: "2px 0 0",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.displayName}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
