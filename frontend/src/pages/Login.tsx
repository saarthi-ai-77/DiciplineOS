import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    if (user) {
        return <Navigate to="/" replace />;
    }

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                toast.success('Registration successful! Please check your email or sign in.');
                setIsSignUp(false);
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                navigate('/');
            }
        } catch (error: any) {
            toast.error(error.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <Card className="w-full max-w-md rounded-none border-2 border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] relative z-10 transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.15)] bg-card">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl font-black text-center uppercase tracking-tighter">Discipline OS</CardTitle>
                    <CardDescription className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        {isSignUp ? 'Initialize Protocol' : 'Sync Session'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-mono text-xs uppercase tracking-widest">Identification</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="rounded-none border-2 font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="font-mono text-xs uppercase tracking-widest">Access Key</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="rounded-none border-2 font-mono"
                            />
                        </div>
                        <Button type="submit" className="w-full rounded-none font-black uppercase tracking-tighter h-12 text-lg hover:bg-accent hover:text-accent-foreground transition-all" disabled={loading}>
                            {loading ? 'Processing...' : isSignUp ? 'CREATE ACCOUNT' : 'AUTHENTICATE'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 pt-0">
                    <Button
                        variant="ghost"
                        className="w-full rounded-none font-mono text-xs uppercase tracking-widest hover:bg-secondary"
                        onClick={() => setIsSignUp(!isSignUp)}
                    >
                        {isSignUp ? 'EXISTING OPERATOR? SIGN IN' : "NEW OPERATOR? INITIALIZE"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
