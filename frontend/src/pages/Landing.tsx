import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Target, Search, BarChart3, Database } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";

const Landing = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground overflow-x-hidden">
            {/* Background Grid Effect */}
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 md:pt-32 pb-24">
                <div className="space-y-8 max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary border border-border text-xs font-mono uppercase tracking-widest text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Zap className="w-3 h-3 text-accent" />
                        V2.0.0 Live
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase animate-in fade-in slide-in-from-bottom-8 duration-700">
                        Discipline <br />
                        <span className="text-accent underline decoration-4 underline-offset-8">Operating</span> System
                    </h1>

                    <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        A radical framework for absolute execution. Track systems, measure output,
                        and dominate your timeline with brutalist precision.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                        <Button
                            size="lg"
                            className="px-8 h-14 text-lg font-bold group rounded-none"
                            onClick={() => navigate("/login")}
                        >
                            INITIALIZE SESSION
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="px-8 h-14 text-lg font-bold rounded-none border-2"
                            onClick={() => {
                                const features = document.getElementById('features');
                                features?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            VIEW CAPABILITIES
                        </Button>
                    </div>
                </div>
            </main>

            {/* Feature Grid */}
            <section id="features" className="relative z-10 border-t border-border bg-background">
                <div className="max-w-7xl mx-auto px-6 py-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
                        <FeatureCard
                            icon={<Target className="w-8 h-8" />}
                            title="System Tracking"
                            description="Define your projects and binary disciplines. Track execution with zero friction."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="w-8 h-8" />}
                            title="Advanced Analytics"
                            description="Measure weekly deltas and moving averages. Understand your momentum at a glance."
                        />
                        <FeatureCard
                            icon={<Search className="w-8 h-8" />}
                            title="Historical Recall"
                            description="Instant semantic search through your experience notes. Find any past moment in seconds."
                        />
                        <FeatureCard
                            icon={<Database className="w-8 h-8" />}
                            title="Immutable Data"
                            description="Stored securely in Supabase. Your execution history is a permanent record of progress."
                        />
                        <FeatureCard
                            icon={<Zap className="w-8 h-8" />}
                            title="Brutalist Design"
                            description="Zero bloat. High contrast. Focused entirely on the metrics that matter."
                        />
                        <div className="bg-background cursor-default p-12 flex flex-col justify-center border-border">
                            <span className="text-3xl font-black uppercase text-accent/50 group-hover:text-accent transition-colors">Phase 2.0</span>
                            <p className="text-muted-foreground mt-2">Now with sticky heatmap views and experience logging.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-border py-12 px-6 bg-secondary/30">
                <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8">
                    <div className="text-2xl font-black italic tracking-tighter">DISCIPLINE OS</div>
                    <div className="flex gap-12 text-sm font-mono text-muted-foreground">
                        <span>© 2025 PROTOCOL ACTIVE</span>
                        <span>0% COMPROMISE</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-background p-8 md:p-12 border-border hover:bg-secondary/20 transition-colors group">
        <div className="text-accent mb-6 group-hover:scale-110 transition-transform origin-left">{icon}</div>
        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4">{title}</h3>
        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{description}</p>
    </div>
);

export default Landing;
