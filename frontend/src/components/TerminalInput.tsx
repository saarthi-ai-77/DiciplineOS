import { useState, useRef, useEffect } from "react";
import { Terminal } from "lucide-react";

interface TerminalInputProps {
    onCommand: (command: string) => void;
    isLoading?: boolean;
}

const TerminalInput = ({ onCommand, isLoading }: TerminalInputProps) => {
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onCommand(input.trim());
            setInput("");
        }
    };

    useEffect(() => {
        // Focus on slash press
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "/" && document.activeElement !== inputRef.current) {
                e.preventDefault();
                inputRef.current?.focus();
                if (!input.startsWith("/")) {
                    setInput("/");
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [input]);

    return (
        <div className="bg-black border-2 border-accent/30 p-4 mb-8 group focus-within:border-accent transition-colors">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-accent animate-pulse" />
                <span className="text-accent font-mono text-sm font-bold">$</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="DISCIPLINE_OS V2.0 // TYPE /LOG [BUILD] [LEARN] '[NOTE]' OR PRESS / TO START"
                    className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-accent placeholder:text-accent/30 selection:bg-accent selection:text-black"
                    disabled={isLoading}
                />
                {isLoading && <span className="text-[10px] font-mono text-accent animate-pulse uppercase">Syncing...</span>}
            </form>
        </div>
    );
};

export default TerminalInput;
