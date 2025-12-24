import { useState } from "react";
import { useDiscipline } from "@/hooks/useDiscipline";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

const Systems = () => {
    const {
        projects,
        customDisciplines,
        addProject,
        deleteProject,
        addCustomDiscipline,
        deleteCustomDiscipline,
        loading,
    } = useDiscipline();

    const [newProjectName, setNewProjectName] = useState("");
    const [newDisciplineName, setNewDisciplineName] = useState("");

    const handleAddProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProjectName.trim()) return;
        await addProject(newProjectName.trim());
        setNewProjectName("");
    };

    const handleAddDiscipline = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDisciplineName.trim()) return;
        await addCustomDiscipline(newDisciplineName.trim());
        setNewDisciplineName("");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="font-mono animate-pulse">LOADING SYSTEMS...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <h1 className="text-xl font-mono font-bold text-foreground mb-8 uppercase tracking-wider">
                    System Configuration
                </h1>

                <div className="grid gap-12">
                    {/* Projects Management */}
                    <section className="space-y-6">
                        <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
                            Active Projects
                        </h2>
                        <form onSubmit={handleAddProject} className="flex gap-2">
                            <Input
                                placeholder="New Project Name..."
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                className="font-mono bg-card border-border"
                            />
                            <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </form>

                        <div className="grid gap-3">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-card border border-border p-4 flex justify-between items-center group"
                                >
                                    <span className="font-mono text-sm text-foreground">{project.name}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteProject(project.id)}
                                        className="text-muted-foreground hover:text-destructive md:opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            {projects.length === 0 && (
                                <p className="text-xs font-mono text-muted-foreground italic">No projects defined.</p>
                            )}
                        </div>
                    </section>

                    {/* Custom Disciplines Management */}
                    <section className="space-y-6">
                        <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
                            Custom Disciplines (Boolean)
                        </h2>
                        <form onSubmit={handleAddDiscipline} className="flex gap-2">
                            <Input
                                placeholder="e.g. No Distractions, Gym, Deep Work..."
                                value={newDisciplineName}
                                onChange={(e) => setNewDisciplineName(e.target.value)}
                                className="font-mono bg-card border-border"
                            />
                            <Button type="submit" size="icon" className="bg-foreground text-background hover:bg-foreground/90">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </form>

                        <div className="grid gap-3">
                            {customDisciplines.map((disc) => (
                                <div
                                    key={disc.id}
                                    className="bg-card border border-border p-4 flex justify-between items-center group"
                                >
                                    <span className="font-mono text-sm text-foreground">{disc.name}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteCustomDiscipline(disc.id)}
                                        className="text-muted-foreground hover:text-destructive md:opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            {customDisciplines.length === 0 && (
                                <p className="text-xs font-mono text-muted-foreground italic">No custom disciplines defined.</p>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Systems;
