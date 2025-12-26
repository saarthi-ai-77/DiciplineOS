import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";

interface FocusTimerProps {
    onComplete?: (hours: number) => void;
}

const FocusTimer = ({ onComplete }: FocusTimerProps) => {
    const [minutes, setMinutes] = useState(50);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);

    const toggle = () => setIsActive(!isActive);

    const reset = useCallback(() => {
        setIsActive(false);
        setIsBreak(false);
        setMinutes(50);
        setSeconds(0);
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive) {
            interval = setInterval(() => {
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                } else if (minutes > 0) {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                } else {
                    // Timer complete
                    setIsActive(false);
                    const completedHours = isBreak ? 0 : 50 / 60;
                    if (!isBreak && onComplete) {
                        onComplete(completedHours);
                    }

                    // Switch mode
                    if (!isBreak) {
                        setIsBreak(true);
                        setMinutes(10);
                    } else {
                        reset();
                    }
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isActive, minutes, seconds, isBreak, onComplete, reset]);

    return (
        <div className="bg-card border-2 border-border p-6 mb-8 relative overflow-hidden group">
            <div className={`absolute top-0 left-0 h-1 bg-accent transition-all duration-1000 ${isActive ? "w-full animate-pulse" : "w-0"}`} />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className={`p-3 border-2 ${isActive ? "border-accent animate-pulse" : "border-border"}`}>
                        <Timer className={`w-6 h-6 ${isActive ? "text-accent" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
                            Focus Pulse // {isBreak ? "RECOVERY MODE" : "EXECUTION MODE"}
                        </div>
                        <div className="text-4xl md:text-5xl font-mono font-black text-foreground tabular-nums">
                            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={toggle}
                        className={`px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest transition-all ${isActive
                                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                : "bg-accent text-accent-foreground hover:bg-accent/90"
                            }`}
                    >
                        {isActive ? (
                            <span className="flex items-center gap-2"><Pause className="w-4 h-4" /> Pause</span>
                        ) : (
                            <span className="flex items-center gap-2"><Play className="w-4 h-4" /> Start</span>
                        )}
                    </button>
                    <button
                        onClick={reset}
                        className="p-3 border-2 border-border hover:border-foreground transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {!isActive && !isBreak && minutes === 50 && (
                <div className="mt-4 flex gap-4">
                    <button onClick={() => setMinutes(25)} className="text-[10px] font-mono hover:text-accent uppercase tracking-wider text-muted-foreground">25m (Sprint)</button>
                    <button onClick={() => setMinutes(50)} className="text-[10px] font-mono hover:text-accent uppercase tracking-wider text-muted-foreground underline">50m (Deep)</button>
                    <button onClick={() => setMinutes(90)} className="text-[10px] font-mono hover:text-accent uppercase tracking-wider text-muted-foreground">90m (Mastery)</button>
                </div>
            )}
        </div>
    );
};

export default FocusTimer;
