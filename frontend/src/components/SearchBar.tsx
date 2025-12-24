import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
    return (
        <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search logs... (e.g. 'Refactoring', 'Launch', 'Blocker')"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-10 font-mono bg-card border-border text-sm placeholder:text-muted-foreground/50 focus:ring-accent"
            />
        </div>
    );
};

export default SearchBar;
