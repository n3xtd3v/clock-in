import { Input } from "@/components/ui/input";

export default function Search({ placeholder }: { placeholder: string }) {
  const handleSearch = (term: string) => {
    console.log(term);
  };

  return (
    <Input
      type="text"
      placeholder={placeholder}
      id="search"
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
}
