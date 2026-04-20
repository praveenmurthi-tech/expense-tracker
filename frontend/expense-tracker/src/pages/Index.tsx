"use client";

import { useState, useRef, useEffect, useMemo, FormEvent } from "react";
import { format } from "date-fns";
import { CalendarIcon, Wallet, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

const API_URL = "http://127.0.0.1:8000/api/v1/expenses/";

const CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Health",
  "Travel",
  "Other",
];

type Expense = {
  id?: string | number;
  amount: number;
  category: string;
  description: string;
  date: string;
};

type SortKey = "date_desc" | "amount_asc" | "amount_desc";

const Index = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("date_desc");

  const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());

  // ✅ FIXED: API GET
  const fetchExpenses = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      const list: Expense[] = Array.isArray(data) ? data : data.expenses ?? [];
      setExpenses(list);
    } catch (err) {
      setFetchError(
        err instanceof Error ? err.message : "Failed to load expenses"
      );
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ✅ FIXED: API POST (replaces simulation)
  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  // ✅ Block blank or whitespace-only inputs
  if (!amount || parseFloat(amount) <= 0) {
    toast.error("Please enter a valid amount");
    return;
  }
  if (!description.trim()) {
    toast.error("Description cannot be empty or spaces only");
    return;
  }
  if (!category) {
    toast.error("Please select a category");
    return;
  }

  // ✅ Ref-based guard prevents any re-entry (works even before React re-renders)
  if (submittingRef.current) return;
  submittingRef.current = true;
  setSubmitting(true);

  const payload = {
    idempotency_key: idempotencyKey, // same key for retries on failure
    amount: parseFloat(amount),
    category,
    description,
    date: date ? date.toISOString().split("T")[0] : null,
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Server error (${res.status})`);

    await res.json();

    toast.success("Expense logged");

    // ✅ Only rotate the key on success (so retries on failure reuse the same key)
    setIdempotencyKey(crypto.randomUUID());

    // ✅ Reset form fields
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(new Date());

    // ✅ Refresh the expense list
    await fetchExpenses();

  } catch (err) {
    // ❌ Do NOT rotate the key here — same key lets backend deduplicate retries
    toast.error(err instanceof Error ? err.message : "Submission failed");
  } finally {
    // ✅ Always release the lock
    submittingRef.current = false;
    setSubmitting(false);
  }
};

  const visibleExpenses = useMemo(() => {
    let list =
      filterCategory === "all"
        ? expenses
        : expenses.filter((ex) => ex.category === filterCategory);

    list = [...list].sort((a, b) => {
      if (sortBy === "amount_asc") return a.amount - b.amount;
      if (sortBy === "amount_desc") return b.amount - a.amount;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return list;
  }, [expenses, filterCategory, sortBy]);

 const total = useMemo(
  () =>
    visibleExpenses.reduce(
      (sum, ex) => sum + Number(ex.amount || 0),
      0
    ),
  [visibleExpenses]
);

  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    expenses.forEach((ex) => ex.category && set.add(ex.category));
    return Array.from(set);
  }, [expenses]);

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Wallet className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Expense Tracker
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Log your spending in seconds. Stay on top of your budget.
          </p>
        </header>

        <Card className="rounded-2xl border-border/60 shadow-lg shadow-foreground/5">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Add new expense</CardTitle>
            <CardDescription>
              Fill in the details below to record an expense.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                  <Input
  id="amount"
  type="text"
  inputMode="decimal"
  placeholder="0.00"
  value={amount}
  onChange={(e) => {
    const val = e.target.value;

    // Block alphabets and special chars — only allow digits and one dot
    if (!/^\d*\.?\d*$/.test(val)) return;

    // Only allow up to 2 decimal places
    if (/\.\d{3,}/.test(val)) return;

    // Remove leading zeros unless it's "0." (like 0.99)
    const cleaned = val.replace(/^0+(?!\.|$)/, "");

    setAmount(cleaned);
  }}
  required
  className="pl-7"
/>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
  id="description"
  type="text"
  placeholder="e.g. Lunch with team"
  value={description}
  onChange={(e) => {
    const cleaned = e.target.value.replace(/[<>"{}\\;`~^|#$%*!?]/g, "");
    // Prevent leading spaces
    if (cleaned.trimStart() !== cleaned) return;
    setDescription(cleaned);
  }}
  onBlur={(e) => {
    // Trim trailing spaces when user leaves the field
    setDescription(e.target.value.trim());
  }}
  required
/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
  <Calendar
    mode="single"
    selected={date}
    onSelect={setDate}
    initialFocus
    disabled={{ after: new Date() }}
    className={cn("p-3 pointer-events-auto")}
  />
</PopoverContent>
                </Popover>
              </div>

              <Button
  type="submit"
  className="w-full"
  disabled={submitting}
  style={{ pointerEvents: submitting ? "none" : "auto" }}
>
                {submitting ? "Submitting..." : "Add Expense"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Expenses list */}
        <Card className="mt-6 rounded-2xl border-border/60 shadow-lg shadow-foreground/5">
          <CardHeader className="space-y-1">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-xl">Your expenses</CardTitle>
                <CardDescription>
                  Filter, sort, and review your spending.
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-semibold tracking-tight">
                  ${total.toFixed(2)}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="filter-category" className="text-xs">
                  Filter by category
                </Label>
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger id="filter-category">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {(availableCategories.length
                      ? availableCategories
                      : CATEGORIES
                    ).map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sort-by" className="text-xs">
                  Sort by
                </Label>
                <Select
                  value={sortBy}
                  onValueChange={(v) => setSortBy(v as SortKey)}
                >
                  <SelectTrigger id="sort-by">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date_desc">Date (newest first)</SelectItem>
                    <SelectItem value="amount_asc">Amount (low → high)</SelectItem>
                    <SelectItem value="amount_desc">Amount (high → low)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {fetchError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Couldn't load expenses</AlertTitle>
                <AlertDescription>{fetchError}</AlertDescription>
              </Alert>
            )}

            <div className="overflow-hidden rounded-lg border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[110px]">Amount</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="ml-auto h-4 w-20" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : visibleExpenses.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-10 text-center text-sm text-muted-foreground"
                      >
                        No expenses to show.
                      </TableCell>
                    </TableRow>
                  ) : (
                    visibleExpenses.map((ex, idx) => (
                      <TableRow key={ex.id ?? idx}>
                        <TableCell className="font-medium">
                          ${Number(ex.amount).toFixed(2)}
                        </TableCell>
                        <TableCell>{ex.category}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {ex.description}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {ex.date ? format(new Date(ex.date), "PP") : "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Your data stays on this device for now.
        </p>
      </div>
    </main>
  );
};

export default Index;
