"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Page {
  id: string;
  title: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
}

interface HomePageSelectorProps {
  defaultType?: string | null;
  defaultId?: string | null;
}

export function HomePageSelector({ defaultType, defaultId }: HomePageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<Page[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedType, setSelectedType] = useState<"page" | "post" | "">(
    (defaultType as "page" | "post") || ""
  );
  const [selectedId, setSelectedId] = useState(defaultId || "");

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);
        const [pagesRes, postsRes] = await Promise.all([
          fetch("/api/pages?published=true&limit=100"),
          fetch("/api/posts?published=true&limit=100"),
        ]);

        const pagesData = await pagesRes.json();
        const postsData = await postsRes.json();

        if (pagesData.success && pagesData.data) {
          setPages(pagesData.data);
        }

        if (postsData.success && postsData.data) {
          setPosts(postsData.data);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, []);

  const allOptions = [
    { type: "", id: "", label: "Trang chủ mặc định (Không chọn)" },
    ...pages.map((page) => ({
      type: "page",
      id: page.id,
      label: `📄 ${page.title} (/${page.slug})`,
    })),
    ...posts.map((post) => ({
      type: "post",
      id: post.id,
      label: `📝 ${post.title} (/${post.slug})`,
    })),
  ];

  const selectedOption = allOptions.find(
    (opt) => opt.type === selectedType && opt.id === selectedId
  );

  const handleSelect = (type: string, id: string) => {
    setSelectedType(type as "page" | "post" | "");
    setSelectedId(id);
    setOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Đang tải danh sách trang...</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Trang chủ</Label>
      
      {/* Hidden inputs for form submission */}
      <input type="hidden" name="homePageType" value={selectedType} />
      <input type="hidden" name="homePageId" value={selectedId} />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            <span className="truncate">
              {selectedOption ? selectedOption.label : "Chọn trang làm trang chủ..."}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Tìm kiếm trang..." />
            <CommandList>
              <CommandEmpty>Không tìm thấy trang nào.</CommandEmpty>
              <CommandGroup>
                {allOptions.map((option) => (
                  <CommandItem
                    key={`${option.type}-${option.id}`}
                    value={option.label}
                    onSelect={() => handleSelect(option.type, option.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedType === option.type && selectedId === option.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <p className="text-xs text-muted-foreground">
        Chọn một trang hoặc bài viết để hiển thị làm trang chủ. Nếu không chọn, sẽ hiển thị giao diện trang chủ mặc định.
      </p>
    </div>
  );
}
