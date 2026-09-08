import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CircleAlert,
  Clock3,
  Database,
  DollarSign,
  Loader2,
  LogOut,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
  Utensils,
  X,
} from "lucide-react";
import type { MenuCategory, MenuItem, MenuItemSize } from "@workspace/api-client-react";
import { readGostoMenu, writeGostoMenu, type GostoMenuDocument } from "@/lib/jsonbin";

type SaveState = "idle" | "saving" | "saved" | "error";
type NewItemInput = {
  name: string;
  nameAr: string;
  mode: "single" | "sizes";
  price: number;
  sizes: MenuItemSize[];
  popular: boolean;
  note: string;
};


function useJsonBinMenu() {
  const [data, setData] = useState<GostoMenuDocument | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const load = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      setData(await readGostoMenu());
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async (categories: MenuCategory[]) => {
    setIsSaving(true);
    try {
      const result = await writeGostoMenu(categories);
      setData(result);
      return result;
    } finally {
      setIsSaving(false);
    }
  };

  return { data, isLoading, isError, refetch: load, isSaving, save };
}

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";

const uniqueId = (value: string, usedIds: string[]) => {
  const base = slugify(value);
  let candidate = base;
  let suffix = 2;
  while (usedIds.includes(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
};

const cloneCategories = (categories: MenuCategory[]): MenuCategory[] =>
  categories.map((category) => ({
    ...category,
    items: category.items.map((item) => ({
      ...item,
      sizes: item.sizes?.map((size) => ({ ...size })),
    })),
  }));

const priceCount = (categories: MenuCategory[]) =>
  categories.reduce(
    (total, category) =>
      total +
      category.items.reduce(
        (itemTotal, item) =>
          itemTotal +
          (item.sizes?.length
            ? item.sizes.length + (item.price !== null && item.price !== undefined ? 1 : 0)
            : 1),
        0,
      ),
    0,
  );

const formatUpdatedAt = (value?: string) => {
  if (!value) return "Dernière version disponible";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Dernière version disponible";
  return `Synchronisé le ${date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}`;
};

function LoadingState() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex animate-pulse items-end justify-between gap-5">
        <div>
          <div className="mb-3 h-3 w-28 bg-white/10" />
          <div className="h-12 w-72 bg-white/10 sm:w-96" />
        </div>
        <div className="hidden h-11 w-36 bg-white/10 sm:block" />
      </div>
      <div className="grid gap-5 lg:grid-cols-[225px_1fr]">
        <div className="hidden h-[450px] animate-pulse bg-white/[0.035] lg:block" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              className="h-20 animate-pulse border border-white/[0.06] bg-white/[0.035]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FailureState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center border border-[#ff6a55]/35 bg-[#ff6a55]/10 text-[#ff795f]">
        <CircleAlert size={28} strokeWidth={1.6} />
      </div>
      <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#ff795f]">
        Menu hors ligne
      </p>
      <h2 className="font-bebas text-4xl tracking-wide text-[#f1e7d0]">
        Impossible de charger les prix
      </h2>
      <p className="mt-3 max-w-sm text-sm leading-6 text-white/45">
        Le menu n&apos;est pas accessible pour le moment. Vérifiez la connexion
        puis essayez à nouveau.
      </p>
      <button
        type="button"
        data-testid="button-retry-menu"
        onClick={onRetry}
        className="mt-7 inline-flex items-center gap-2 border border-[#ff7a00]/50 bg-[#ff7a00]/10 px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff9a42] transition-colors hover:bg-[#ff7a00]/20"
      >
        <RotateCcw size={14} />
        Réessayer
      </button>
    </div>
  );
}

function ModalShell({
  title,
  eyebrow,
  children,
  onClose,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[90dvh] w-full max-w-xl overflow-y-auto border border-white/[0.14] bg-[#0b0b0b] shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.1] px-5 py-4">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#ff7a00]">
              {eyebrow}
            </p>
            <h2 className="mt-1 font-bebas text-3xl tracking-wide text-[#f1e7d0]">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-white/[0.12] p-2 text-white/45 transition-colors hover:border-white/30 hover:text-white"
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  dir,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dir?: "rtl" | "ltr";
  type?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
        {label}
      </span>
      <input
        type={type}
        min={type === "number" ? 0 : undefined}
        step={type === "number" ? 1 : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="h-11 w-full border border-white/[0.12] bg-[#050505] px-3 text-sm text-[#f1e7d0] outline-none placeholder:text-white/20 focus:border-[#ff7a00]/60"
      />
    </label>
  );
}

function NewItemDialog({
  categoryName,
  onClose,
  onSubmit,
}: {
  categoryName: string;
  onClose: () => void;
  onSubmit: (input: NewItemInput) => void;
}) {
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [mode, setMode] = useState<"single" | "sizes">("single");
  const [price, setPrice] = useState("0");
  const [sizes, setSizes] = useState<MenuItemSize[]>([
    { label: "L", price: 0 },
    { label: "XL", price: 0 },
  ]);
  const [popular, setPopular] = useState(false);
  const [note, setNote] = useState("");

  const updateSize = (index: number, field: "label" | "price", value: string) => {
    setSizes((current) =>
      current.map((size, sizeIndex) =>
        sizeIndex === index
          ? { ...size, [field]: field === "price" ? Number(value) || 0 : value }
          : size,
      ),
    );
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      nameAr: nameAr.trim(),
      mode,
      price: Number(price) || 0,
      sizes: sizes.filter((size) => size.label.trim()),
      popular,
      note: note.trim(),
    });
  };

  return (
    <ModalShell title="Ajouter un article" eyebrow={`Nouveau produit · ${categoryName}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput label="Nom du produit *" value={name} onChange={setName} placeholder="Ex. Pizza spéciale" />
          <FormInput label="Nom arabe" value={nameAr} onChange={setNameAr} placeholder="الاسم" dir="rtl" />
        </div>

        <div>
          <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
            Type de tarif
          </p>
          <div className="grid grid-cols-2 gap-2">
            {([
              ["single", "Prix unique"],
              ["sizes", "Plusieurs formats"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={`border px-3 py-3 text-left text-xs font-bold transition-colors ${
                  mode === value
                    ? "border-[#ff7a00]/70 bg-[#ff7a00]/10 text-[#ff9a42]"
                    : "border-white/[0.1] text-white/45 hover:border-white/25"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {mode === "single" ? (
          <FormInput label="Prix en DA" value={price} onChange={setPrice} type="number" />
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                Formats et prix
              </p>
              <button
                type="button"
                onClick={() => setSizes((current) => [...current, { label: "XXL", price: 0 }])}
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#39ff14] hover:text-white"
              >
                <Plus size={13} /> Ajouter format
              </button>
            </div>
            {sizes.map((size, index) => (
              <div key={`${index}-${size.label}`} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <FormInput
                  label={index === 0 ? "Format" : ""}
                  value={size.label}
                  onChange={(value) => updateSize(index, "label", value)}
                  placeholder="L"
                />
                <FormInput
                  label={index === 0 ? "Prix DA" : ""}
                  value={String(size.price)}
                  onChange={(value) => updateSize(index, "price", value)}
                  type="number"
                />
                <button
                  type="button"
                  onClick={() => setSizes((current) => current.filter((_, sizeIndex) => sizeIndex !== index))}
                  className="mt-auto mb-0.5 border border-white/[0.1] px-3 text-white/35 hover:border-[#ff795f]/50 hover:text-[#ff795f]"
                  aria-label="Supprimer le format"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput label="Note (optionnel)" value={note} onChange={setNote} placeholder="XXL — partage" />
          <label className="flex items-end gap-2 pb-3 text-xs text-white/55">
            <input
              type="checkbox"
              checked={popular}
              onChange={(event) => setPopular(event.target.checked)}
              className="h-4 w-4 accent-[#ff7a00]"
            />
            Produit populaire
          </label>
        </div>

        <div className="flex justify-end gap-2 border-t border-white/[0.1] pt-4">
          <button type="button" onClick={onClose} className="border border-white/[0.12] px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-white/45 hover:text-white">
            Annuler
          </button>
          <button
            type="submit"
            disabled={!name.trim() || (mode === "sizes" && sizes.length === 0)}
            className="inline-flex items-center gap-2 border border-[#ff7a00] bg-[#ff7a00] px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-[#160b05] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={14} /> Ajouter le produit
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function NewCategoryDialog({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (name: string, nameAr: string) => void;
}) {
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (name.trim()) onSubmit(name.trim(), nameAr.trim());
  };

  return (
    <ModalShell title="Ajouter un صنف" eyebrow="Nouvelle catégorie" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput label="Nom du صنف *" value={name} onChange={setName} placeholder="Ex. Salades" />
          <FormInput label="Nom arabe" value={nameAr} onChange={setNameAr} placeholder="اسم الصنف" dir="rtl" />
        </div>
        <p className="border border-[#39ff14]/15 bg-[#39ff14]/[0.04] p-3 text-xs leading-5 text-white/40">
          سيتم إنشاء المعرّف والألوان الافتراضية تلقائيًا. يمكنك إضافة المنتجات بعد إنشاء الصنف.
        </p>
        <div className="flex justify-end gap-2 border-t border-white/[0.1] pt-4">
          <button type="button" onClick={onClose} className="border border-white/[0.12] px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-white/45 hover:text-white">
            Annuler
          </button>
          <button type="submit" disabled={!name.trim()} className="inline-flex items-center gap-2 border border-[#ff7a00] bg-[#ff7a00] px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-[#160b05] disabled:cursor-not-allowed disabled:opacity-40">
            <Plus size={14} /> Ajouter le صنف
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function PriceInput({
  value,
  onChange,
  testId,
}: {
  value: number;
  onChange: (value: number) => void;
  testId: string;
}) {
  return (
    <label className="group relative flex items-center border border-white/[0.11] bg-[#080808] transition-colors focus-within:border-[#39ff14]/65">
      <span className="pointer-events-none absolute left-3 text-[10px] font-bold text-white/30">
        DA
      </span>
      <input
        type="number"
        min="0"
        step="1"
        inputMode="numeric"
        value={value}
        data-testid={testId}
        onChange={(event) => {
          const nextValue = Number(event.target.value);
          onChange(Number.isFinite(nextValue) && nextValue >= 0 ? nextValue : 0);
        }}
        className="h-11 w-full min-w-0 bg-transparent pl-10 pr-3 text-right font-mono text-sm font-bold text-[#f1e7d0] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        aria-label="Prix en dinars algériens"
      />
    </label>
  );
}

function MenuItemRow({
  categoryId,
  item,
  onPriceChange,
  onDelete,
  index,
}: {
  categoryId: string;
  item: MenuItem;
  onPriceChange: (
    categoryId: string,
    itemId: string,
    sizeLabel: string | null,
    value: number,
  ) => void;
  onDelete: (categoryId: string, itemId: string) => void;
  index: number;
}) {
  const hasSizes = Boolean(item.sizes?.length);

  return (
    <div
      className="group border-t border-white/[0.07] px-4 py-4 first:border-t-0 sm:px-5"
      data-testid={`row-menu-item-${item.id}`}
    >
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-[15px] font-bold text-[#f1e7d0]">
                {item.name}
              </span>
              {item.popular && (
                <span className="border border-[#ff7a00]/25 bg-[#ff7a00]/10 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#ff9a42]">
                  Populaire
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              {item.nameAr && (
                <span className="text-xs text-white/30" dir="rtl">
                  {item.nameAr}
                </span>
              )}
              {item.note && (
                <span className="text-[10px] uppercase tracking-[0.12em] text-white/25">
                  {item.note}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onDelete(categoryId, item.id)}
            className="shrink-0 border border-white/[0.1] p-2 text-white/25 transition-colors hover:border-[#ff795f]/50 hover:text-[#ff795f]"
            aria-label={`Supprimer ${item.name}`}
            title="Supprimer le produit"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {hasSizes ? (
          <div className="grid grid-cols-2 gap-2 sm:min-w-[260px] sm:grid-cols-3">
            {item.price !== null && item.price !== undefined && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 px-0.5">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#ff9a42]">
                    Base
                  </span>
                  <span className="font-mono text-[8px] text-white/20">01</span>
                </div>
                <PriceInput
                  value={item.price}
                  testId={`input-price-${item.id}-base`}
                  onChange={(value) => onPriceChange(categoryId, item.id, null, value)}
                />
              </div>
            )}
            {item.sizes?.map((size) => (
              <div key={size.label} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 px-0.5">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#b9c58a]">
                    {size.label}
                  </span>
                  <span className="font-mono text-[8px] text-white/20">
                    {index + (item.price !== null && item.price !== undefined ? 2 : 1) < 10
                      ? `0${index + (item.price !== null && item.price !== undefined ? 2 : 1)}`
                      : index + (item.price !== null && item.price !== undefined ? 2 : 1)}
                  </span>
                </div>
                <PriceInput
                  value={size.price}
                  testId={`input-price-${item.id}-${size.label}`}
                  onChange={(value) =>
                    onPriceChange(categoryId, item.id, size.label, value)
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="sm:min-w-[145px]">
            <p className="mb-1.5 px-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
              Prix unique
            </p>
            <PriceInput
              value={item.price ?? 0}
              testId={`input-price-${item.id}`}
              onChange={(value) => onPriceChange(categoryId, item.id, null, value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function CategorySection({
  category,
  onPriceChange,
  onDeleteItem,
  onAddItem,
}: {
  category: MenuCategory;
  onPriceChange: (
    categoryId: string,
    itemId: string,
    sizeLabel: string | null,
    value: number,
  ) => void;
  onDeleteItem: (categoryId: string, itemId: string) => void;
  onAddItem: (categoryId: string) => void;
}) {
  const priceTotal = category.items.reduce(
    (total, item) =>
      total +
      (item.sizes?.length
        ? item.sizes.length + (item.price !== null && item.price !== undefined ? 1 : 0)
        : 1),
    0,
  );

  return (
    <section
      id={`category-${category.id}`}
      className="scroll-mt-24 overflow-hidden border border-white/[0.09] bg-[#0c0c0c]/92"
      data-testid={`section-category-${category.id}`}
    >
      <div
        className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] px-4 py-5 sm:px-5"
        style={{
          background: `linear-gradient(105deg, ${category.glow} 0%, rgba(0,0,0,0) 58%)`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center border"
            style={{
              borderColor: `${category.accent}70`,
              color: category.accent,
              background: `${category.accent}13`,
            }}
          >
            <Utensils size={18} strokeWidth={1.7} />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h2 className="font-bebas text-2xl tracking-wide text-[#f1e7d0]">
                {category.name}
              </h2>
              <span className="text-sm text-white/30" dir="rtl">
                {category.nameAr}
              </span>
            </div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
              {category.items.length} articles · {priceTotal} prix éditables
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="hidden font-mono text-[10px] font-bold uppercase tracking-[0.2em] sm:inline"
            style={{ color: category.accent }}
          >
            {category.id}
          </span>
          <button
            type="button"
            onClick={() => onAddItem(category.id)}
            className="inline-flex items-center gap-1 border border-[#39ff14]/35 bg-[#39ff14]/[0.06] px-2.5 py-2 font-mono text-[9px] font-bold uppercase tracking-wider text-[#39ff14] transition-colors hover:bg-[#39ff14]/[0.14]"
          >
            <Plus size={13} /> Ajouter
          </button>
        </div>
      </div>
      {category.items.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-white/35">
          Cette catégorie ne contient aucun article.
        </div>
      ) : (
        category.items.map((item, index) => (
          <MenuItemRow
            key={item.id}
            categoryId={category.id}
            item={item}
            index={index}
            onPriceChange={onPriceChange}
            onDelete={onDeleteItem}
          />
        ))
      )}
    </section>
  );
}

export default function DashboardPage({ onLogout }: { onLogout: () => void }) {
  const menuQuery = useJsonBinMenu();
  const [draft, setDraft] = useState<MenuCategory[] | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [itemDialogCategoryId, setItemDialogCategoryId] = useState<string | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  const serverMenu = menuQuery.data;

  useEffect(() => {
    if (serverMenu?.categories && draft === null) {
      const cloned = cloneCategories(serverMenu.categories);
      setDraft(cloned);
      setSavedSnapshot(JSON.stringify(cloned));
    }
  }, [serverMenu, draft]);

  const draftSnapshot = useMemo(() => JSON.stringify(draft ?? []), [draft]);
  const isDirty = draft !== null && draftSnapshot !== savedSnapshot;

  const visibleCategories = useMemo(() => {
    if (!draft) return [];
    const normalizedSearch = search.trim().toLocaleLowerCase();
    return draft.filter((category) => {
      if (activeCategory !== "all" && category.id !== activeCategory) return false;
      if (!normalizedSearch) return true;
      return (
        category.name.toLocaleLowerCase().includes(normalizedSearch) ||
        category.nameAr.includes(search.trim()) ||
        category.items.some((item) =>
          `${item.name} ${item.nameAr ?? ""}`
            .toLocaleLowerCase()
            .includes(normalizedSearch),
        )
      );
    });
  }, [activeCategory, draft, search]);

  const totalItems = draft?.reduce((count, category) => count + category.items.length, 0) ?? 0;
  const totalPrices = draft ? priceCount(draft) : 0;

  const handlePriceChange = (
    categoryId: string,
    itemId: string,
    sizeLabel: string | null,
    value: number,
  ) => {
    setSaveState("idle");
    setSaveMessage("");
    setDraft((current) => {
      if (!current) return current;
      return current.map((category) => {
        if (category.id !== categoryId) return category;
        return {
          ...category,
          items: category.items.map((item) => {
            if (item.id !== itemId) return item;
            if (sizeLabel !== null) {
              return {
                ...item,
                sizes: item.sizes?.map((size) =>
                  size.label === sizeLabel ? { ...size, price: value } : size,
                ),
              };
            }
            return { ...item, price: value };
          }),
        };
      });
    });
  };

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    const item = draft?.find((category) => category.id === categoryId)?.items.find(
      (candidate) => candidate.id === itemId,
    );
    if (!item || !window.confirm(`Supprimer « ${item.name} » ?`)) return;

    setSaveState("idle");
    setSaveMessage("");
    setDraft((current) =>
      current?.map((category) =>
        category.id === categoryId
          ? { ...category, items: category.items.filter((candidate) => candidate.id !== itemId) }
          : category,
      ) ?? current,
    );
  };

  const handleAddItem = (categoryId: string, input: NewItemInput) => {
    setSaveState("idle");
    setSaveMessage("");
    setDraft((current) => {
      if (!current) return current;
      const usedIds = current.flatMap((category) => category.items.map((item) => item.id));
      const nextItem: MenuItem = {
        id: uniqueId(`${categoryId}-${input.name}`, usedIds),
        name: input.name,
        nameAr: input.nameAr || null,
        price: input.mode === "single" ? input.price : null,
        sizes: input.mode === "sizes" ? input.sizes : null,
        popular: input.popular,
        note: input.note || null,
      };
      return current.map((category) =>
        category.id === categoryId
          ? { ...category, items: [...category.items, nextItem] }
          : category,
      );
    });
    setItemDialogCategoryId(null);
  };

  const handleAddCategory = (name: string, nameAr: string) => {
    setSaveState("idle");
    setSaveMessage("");
    setDraft((current) => {
      if (!current) return current;
      const id = uniqueId(name, current.map((category) => category.id));
      const nextCategory: MenuCategory = {
        id,
        name,
        nameAr: nameAr || name,
        icon: "utensils",
        accent: "#FF7A00",
        glow: "rgba(255,122,0,0.3)",
        items: [],
      };
      return [...current, nextCategory];
    });
    setActiveCategory("all");
    setCategoryDialogOpen(false);
  };

  const handleReset = () => {
    if (!serverMenu?.categories) return;
    const cloned = cloneCategories(serverMenu.categories);
    setDraft(cloned);
    setSavedSnapshot(JSON.stringify(cloned));
    setSaveState("idle");
    setSaveMessage("");
  };

  const handleSave = async () => {
    if (!draft || !isDirty || menuQuery.isSaving) return;
    setSaveState("saving");
    setSaveMessage("Enregistrement dans JSONBin en cours…");
    try {
      const result = await menuQuery.save(draft);
      const nextDraft = cloneCategories(result.categories);
      setDraft(nextDraft);
      setSavedSnapshot(JSON.stringify(nextDraft));
      setSaveState("saved");
      setSaveMessage("Menu enregistré avec succès");
    } catch {
      setSaveState("error");
      setSaveMessage("Enregistrement impossible. Vérifiez la clé JSONBin.");
    }
  };

  const isInitialLoading = menuQuery.isLoading && draft === null;

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-[#050505] text-[#f1e7d0]">
      <header className="sticky top-0 z-40 border-b border-white/[0.09] bg-[#050505]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[68px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <a
              href="/"
              data-testid="link-dashboard-home"
              className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/[0.12] text-white/55 transition-colors hover:border-[#ff7a00]/60 hover:text-[#ff9a42]"
              aria-label="Retour à l'accueil"
            >
              <ArrowLeft size={16} />
            </a>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bebas text-xl tracking-[0.12em] text-[#f1e7d0]">
                  GOSTO
                </span>
                <span className="hidden font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#39ff14] sm:inline">
                  Food / Control
                </span>
              </div>
              <p className="truncate font-mono text-[9px] uppercase tracking-[0.15em] text-white/30">
                Éditeur du menu
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <div
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35"
              data-testid="status-sync"
            >
              <span className="h-1.5 w-1.5 bg-[#39ff14] shadow-[0_0_8px_#39ff14]" />
              Système connecté
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 border border-white/[0.1] px-2.5 py-2 font-mono text-[9px] font-bold uppercase tracking-wider text-white/40 transition-colors hover:border-[#ff795f]/50 hover:text-[#ff9b88]"
            >
              <LogOut size={13} /> Sortir
            </button>
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-[1440px] px-4 pb-28 pt-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-6 border-b border-white/[0.08] pb-7 lg:flex-row lg:items-end">
            <div>
              <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-[#ff7a00]">
                <span className="mr-2 text-[#39ff14]">01</span> Menu control
              </p>
              <h1 className="font-bebas text-5xl leading-[0.92] tracking-wide text-[#f1e7d0] sm:text-6xl">
                Les prix, <span className="text-[#ff7a00]">à jour.</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
                Modifiez chaque tarif du menu GOSTO, y compris les formats. Une
                seule sauvegarde met à jour toute la carte publique.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:min-w-[360px]">
              <button
                type="button"
                onClick={() => setCategoryDialogOpen(true)}
                className="inline-flex items-center justify-center gap-2 border border-[#39ff14]/45 bg-[#39ff14]/[0.07] px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#39ff14] transition-colors hover:bg-[#39ff14]/[0.14]"
              >
                <Plus size={14} /> Ajouter un صنف
              </button>
              <div className="grid grid-cols-2 gap-px border border-white/[0.08] bg-white/[0.08]">
                <div className="bg-[#101010] px-4 py-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                    Catégories
                  </p>
                  <p className="mt-1 font-bebas text-3xl text-[#f1e7d0]">
                    {draft?.length ?? "—"}
                  </p>
                </div>
                <div className="bg-[#101010] px-4 py-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                    Articles
                  </p>
                  <p className="mt-1 font-bebas text-3xl text-[#39ff14]">
                    {draft ? totalItems : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {isInitialLoading ? (
            <LoadingState />
          ) : menuQuery.isError && draft === null ? (
            <FailureState onRetry={() => void menuQuery.refetch()} />
          ) : !draft || draft.length === 0 ? (
            <div className="flex min-h-[45vh] flex-col items-center justify-center border border-dashed border-white/[0.14] px-5 text-center">
              <Database size={28} className="mb-4 text-white/25" strokeWidth={1.5} />
              <h2 className="font-bebas text-3xl text-[#f1e7d0]">Menu vide</h2>
              <p className="mt-2 text-sm text-white/40">
                Aucune catégorie n&apos;est disponible à éditer.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-col gap-3 border border-white/[0.08] bg-[#0c0c0c]/88 p-3 sm:flex-row sm:items-center">
                <div className="relative min-w-0 flex-1">
                  <Search
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Rechercher un article ou une catégorie"
                    data-testid="input-search-menu"
                    className="h-11 w-full border border-white/[0.1] bg-[#080808] pl-10 pr-9 text-sm text-[#f1e7d0] outline-none placeholder:text-white/25 focus:border-[#ff7a00]/60"
                  />
                  {search && (
                    <button
                      type="button"
                      data-testid="button-clear-search"
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/75"
                      aria-label="Effacer la recherche"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
                  <span className="hidden shrink-0 font-mono text-[9px] uppercase tracking-[0.16em] text-white/25 sm:inline">
                    Filtrer
                  </span>
                  <button
                    type="button"
                    data-testid="button-filter-all"
                    onClick={() => setActiveCategory("all")}
                    className={`shrink-0 border px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${
                      activeCategory === "all"
                        ? "border-[#39ff14]/60 bg-[#39ff14]/10 text-[#39ff14]"
                        : "border-white/[0.1] text-white/40 hover:border-white/25 hover:text-white/70"
                    }`}
                  >
                    Tout
                  </button>
                  {draft.map((category) => (
                    <button
                      type="button"
                      key={category.id}
                      data-testid={`button-filter-${category.id}`}
                      onClick={() => setActiveCategory(category.id)}
                      className={`shrink-0 border px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${
                        activeCategory === category.id
                          ? "border-[#ff7a00]/60 bg-[#ff7a00]/10 text-[#ff9a42]"
                          : "border-white/[0.1] text-white/40 hover:border-white/25 hover:text-white/70"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[225px_minmax(0,1fr)] xl:grid-cols-[245px_minmax(0,1fr)]">
                <aside className="hidden self-start lg:sticky lg:top-[92px] lg:block">
                  <div className="border border-white/[0.09] bg-[#0c0c0c]/82 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
                        Index carte
                      </p>
                      <ChevronDown size={13} className="text-white/25" />
                    </div>
                    <nav className="space-y-1" aria-label="Catégories du menu">
                      {draft.map((category, index) => (
                        <a
                          key={category.id}
                          href={`#category-${category.id}`}
                          data-testid={`link-category-${category.id}`}
                          onClick={() => setActiveCategory(category.id)}
                          className="group flex items-center gap-2 px-2 py-2 text-xs text-white/45 transition-colors hover:bg-white/[0.04] hover:text-[#f1e7d0]"
                        >
                          <span className="w-5 font-mono text-[9px] text-white/20">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="truncate">{category.name}</span>
                          <span className="ml-auto font-mono text-[9px] text-white/20">
                            {category.items.length}
                          </span>
                        </a>
                      ))}
                    </nav>
                  </div>
                  <div className="mt-3 border border-[#39ff14]/15 bg-[#39ff14]/[0.035] p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#39ff14]">
                      <DollarSign size={15} />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em]">
                        Champ d&apos;action
                      </span>
                    </div>
                    <p className="text-xs leading-5 text-white/35">
                      {totalPrices} prix sont synchronisés dans cette carte.
                    </p>
                  </div>
                </aside>

                <div className="space-y-5">
                  {visibleCategories.length > 0 ? (
                    visibleCategories.map((category) => (
                      <CategorySection
                        key={category.id}
                        category={category}
                        onPriceChange={handlePriceChange}
                        onDeleteItem={handleDeleteItem}
                        onAddItem={setItemDialogCategoryId}
                      />
                    ))
                  ) : (
                    <div className="flex min-h-[250px] flex-col items-center justify-center border border-dashed border-white/[0.14] px-5 text-center">
                      <Search size={24} className="mb-3 text-white/25" />
                      <p className="font-bebas text-2xl text-[#f1e7d0]">Aucun résultat</p>
                      <p className="mt-1 text-sm text-white/35">
                        Essayez un autre nom d&apos;article ou de catégorie.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {itemDialogCategoryId && draft && (
        <NewItemDialog
          key={itemDialogCategoryId}
          categoryName={
            draft.find((category) => category.id === itemDialogCategoryId)?.name ?? "Catégorie"
          }
          onClose={() => setItemDialogCategoryId(null)}
          onSubmit={(input) => handleAddItem(itemDialogCategoryId, input)}
        />
      )}
      {categoryDialogOpen && (
        <NewCategoryDialog
          onClose={() => setCategoryDialogOpen(false)}
          onSubmit={handleAddCategory}
        />
      )}

      {draft && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.12] bg-[#050505]/95 backdrop-blur-xl">
          <div className="mx-auto flex min-h-[70px] max-w-[1440px] flex-col justify-between gap-3 px-4 py-3 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center border ${
                  isDirty
                    ? "border-[#ff7a00]/50 bg-[#ff7a00]/10 text-[#ff9a42]"
                    : "border-[#39ff14]/35 bg-[#39ff14]/10 text-[#39ff14]"
                }`}
              >
                {saveState === "saving" ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : saveState === "saved" ? (
                  <Check size={15} />
                ) : isDirty ? (
                  <Clock3 size={15} />
                ) : (
                  <Check size={15} />
                )}
              </div>
              <div className="min-w-0">
                <p
                  className={`font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${
                    saveState === "error"
                      ? "text-[#ff795f]"
                      : isDirty
                        ? "text-[#ff9a42]"
                        : "text-[#39ff14]"
                  }`}
                  data-testid="status-save"
                >
                  {saveState === "saving"
                    ? "Sauvegarde en cours"
                    : saveState === "error"
                      ? "Échec de sauvegarde"
                      : isDirty
                        ? "Modifications non enregistrées"
                        : saveState === "saved"
                          ? "Menu enregistré"
                          : "Menu synchronisé"}
                </p>
                <p className="truncate text-xs text-white/35">
                  {saveMessage ||
                    (isDirty
                      ? "La carte publique n'est pas encore mise à jour."
                      : formatUpdatedAt(serverMenu?.updatedAt))}
                </p>
              </div>
            </div>
            <div className="flex gap-2 sm:shrink-0">
              <button
                type="button"
                data-testid="button-reset-menu"
                onClick={handleReset}
                disabled={!isDirty || menuQuery.isSaving}
                className="border border-white/[0.12] px-3 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/45 transition-colors hover:border-white/30 hover:text-white/75 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Annuler
              </button>
              <button
                type="button"
                data-testid="button-save-menu"
                onClick={handleSave}
                disabled={!isDirty || menuQuery.isSaving}
                className="inline-flex flex-1 items-center justify-center gap-2 border border-[#ff7a00] bg-[#ff7a00] px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-[#1a0b0e] transition-all hover:bg-[#ff9838] disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-white/10 disabled:text-white/35 sm:flex-none"
              >
                {menuQuery.isSaving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                Enregistrer le menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}