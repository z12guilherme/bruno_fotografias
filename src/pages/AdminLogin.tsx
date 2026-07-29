import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, Loader2, KeyRound, ShieldCheck, ArrowLeft } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Email inválido." }),
  password: z.string().min(1, { message: "Digite sua senha." }),
});

export default function AdminLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Estados para verificação de 2FA (MFA)
  const [step, setStep] = useState<"credentials" | "mfa">("credentials");
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // 1. Tenta fazer login no Supabase Auth com email e senha
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;
      if (!data.user) throw new Error("Erro de autenticação.");

      // 2. Verifica se o usuário tem permissão de admin na tabela 'profiles'
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      if (profile?.role !== 'admin') {
        await supabase.auth.signOut(); // Desloga se não for admin
        throw new Error("Acesso restrito a administradores.");
      }

      // 3. Verifica se o usuário exige autenticação de 2 Fatores (AAL2)
      const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (mfaError) throw mfaError;

      if (mfaData && mfaData.nextLevel === 'aal2' && mfaData.currentLevel !== 'aal2') {
        // Usuário possui 2FA cadastrado! Obter o fator TOTP ativo.
        const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
        if (factorsError) throw factorsError;

        const verifiedTotp = factorsData.totp?.find((f) => f.status === 'verified');
        if (verifiedTotp) {
          setMfaFactorId(verifiedTotp.id);
          setStep("mfa");
          setIsLoading(false);
          toast({
            title: "2FA Requerido",
            description: "Digite o código de 6 dígitos do seu aplicativo autenticador.",
          });
          return;
        }
      }

      toast({
        title: "Login realizado!",
        description: "Redirecionando para o painel...",
      });
      
      navigate("/admin");
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: error.message === "Invalid login credentials" 
          ? "Email ou senha incorretos." 
          : error.message || "Ocorreu um erro ao tentar entrar.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyMfa(e: React.FormEvent) {
    e.preventDefault();
    if (!mfaFactorId || mfaCode.length < 6) {
      toast({
        variant: "destructive",
        title: "Código inválido",
        description: "Informe o código de 6 dígitos do seu aplicativo de autenticação.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // 1. Criar desafio MFA
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: mfaFactorId,
      });

      if (challengeError) throw challengeError;

      // 2. Validar o código digitado
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: mfaFactorId,
        challengeId: challengeData.id,
        code: mfaCode.trim(),
      });

      if (verifyError) throw verifyError;

      toast({
        title: "2FA Verificado com sucesso!",
        description: "Redirecionando para o painel administrativo...",
      });

      navigate("/admin");
    } catch (error: any) {
      console.error("Erro ao verificar código MFA:", error);
      toast({
        variant: "destructive",
        title: "Código 2FA incorreto",
        description: error.message || "Verifique o código no seu aplicativo autenticador e tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCancelMfa() {
    await supabase.auth.signOut();
    setStep("credentials");
    setMfaFactorId(null);
    setMfaCode("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border">
        
        {step === "credentials" ? (
          <>
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Área Administrativa</h2>
              <p className="mt-2 text-sm text-gray-600">Entre com suas credenciais de fotógrafo</p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input className="pl-10" placeholder="admin@exemplo.com" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input type="password" className="pl-10" placeholder="••••••••" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </Form>
          </>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-3">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Autenticação em 2 Etapas</h2>
              <p className="mt-1 text-sm text-gray-600">
                Abra seu aplicativo autenticador (Google Authenticator / Authy) e insira o código de 6 dígitos.
              </p>
            </div>

            <form onSubmit={handleVerifyMfa} className="space-y-6">
              <div>
                <Label htmlFor="mfaCode" className="text-sm font-medium text-gray-700">
                  Código de Verificação
                </Label>
                <div className="relative mt-1">
                  <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="mfaCode"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="123456"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
                    className="pl-10 text-center font-mono text-xl tracking-widest h-12 border-amber-300 focus:border-amber-500"
                    autoFocus
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                disabled={isLoading || mfaCode.length < 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validando Código...
                  </>
                ) : (
                  "Verificar e Entrar"
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-gray-500"
                onClick={handleCancelMfa}
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Login
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}