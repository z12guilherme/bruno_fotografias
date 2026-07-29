import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, ShieldAlert, Loader2, Copy, Check, Key, QrCode, Trash2, Info } from "lucide-react";

interface Factor {
  id: string;
  friendly_name?: string;
  factor_type: string;
  status: "verified" | "unverified";
  created_at: string;
}

export function SecuritySettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [verifiedFactor, setVerifiedFactor] = useState<Factor | null>(null);
  
  // Estados do fluxo de ativação
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollData, setEnrollData] = useState<{
    id: string;
    qrCode: string;
    secret: string;
  } | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [unenrolling, setUnenrolling] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  useEffect(() => {
    fetchMfaFactors();
  }, []);

  async function fetchMfaFactors() {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;

      const activeFactor = data.totp?.find((f) => f.status === "verified");
      setVerifiedFactor((activeFactor as Factor) || null);
    } catch (err: any) {
      console.error("Erro ao buscar fatores MFA:", err);
      toast({
        variant: "destructive",
        title: "Erro ao carregar status do 2FA",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function startEnrollment() {
    setIsEnrolling(true);
    setVerificationCode("");
    try {
      // 1. Limpa qualquer fator TOTP pendente/não verificado de tentativas anteriores
      const { data: existingFactors } = await supabase.auth.mfa.listFactors();
      if (existingFactors?.totp) {
        const unverifiedFactors = existingFactors.totp.filter((f) => f.status === "unverified");
        for (const factor of unverifiedFactors) {
          await supabase.auth.mfa.unenroll({ factorId: factor.id });
        }
      }

      // 2. Inicia o cadastro do novo fator TOTP
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        issuer: "Bruno Nascimento Fotografia",
        friendlyName: "Authenticator App",
      });

      if (error) throw error;

      if (data && data.totp) {
        setEnrollData({
          id: data.id,
          qrCode: data.totp.qr_code,
          secret: data.totp.secret,
        });
      }
    } catch (err: any) {
      console.error("Erro ao iniciar configuração 2FA:", err);
      toast({
        variant: "destructive",
        title: "Erro ao gerar código 2FA",
        description: err.message,
      });
      setIsEnrolling(false);
    }
  }

  async function confirmEnrollment(e: React.FormEvent) {
    e.preventDefault();
    if (!enrollData || !verificationCode || verificationCode.length < 6) {
      toast({
        variant: "destructive",
        title: "Código inválido",
        description: "Digite o código de 6 dígitos gerado pelo seu aplicativo autenticador.",
      });
      return;
    }

    setVerifying(true);
    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: enrollData.id,
      });

      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: enrollData.id,
        challengeId: challengeData.id,
        code: verificationCode.trim(),
      });

      if (verifyError) throw verifyError;

      toast({
        title: "2FA Ativado com Sucesso! 🎉",
        description: "Sua conta agora exige autenticação em duas etapas para fazer login.",
      });

      setIsEnrolling(false);
      setEnrollData(null);
      setVerificationCode("");
      await fetchMfaFactors();
    } catch (err: any) {
      console.error("Erro ao verificar código 2FA:", err);
      toast({
        variant: "destructive",
        title: "Erro na ativação do 2FA",
        description: err.message || "Código inválido ou expirado. Tente novamente.",
      });
    } finally {
      setVerifying(false);
    }
  }

  async function cancelEnrollment() {
    if (enrollData?.id) {
      // Remove o fator não verificado criado temporariamente
      await supabase.auth.mfa.unenroll({ factorId: enrollData.id });
    }
    setIsEnrolling(false);
    setEnrollData(null);
    setVerificationCode("");
  }

  async function disable2FA() {
    if (!verifiedFactor) return;

    if (!confirm("Tem certeza que deseja desativar a autenticação de 2 fatores? Sua conta ficará vulnerável se a senha for vazada.")) {
      return;
    }

    setUnenrolling(true);
    try {
      const { error } = await supabase.auth.mfa.unenroll({
        factorId: verifiedFactor.id,
      });

      if (error) throw error;

      toast({
        title: "2FA Desativado",
        description: "A autenticação de dois fatores foi removida da sua conta.",
      });

      await fetchMfaFactors();
    } catch (err: any) {
      console.error("Erro ao desativar 2FA:", err);
      toast({
        variant: "destructive",
        title: "Erro ao desativar 2FA",
        description: err.message,
      });
    } finally {
      setUnenrolling(false);
    }
  }

  function copySecretToClipboard() {
    if (enrollData?.secret) {
      navigator.clipboard.writeText(enrollData.secret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
      toast({ title: "Chave secreta copiada para a área de transferência!" });
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header do Painel de Segurança */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-600" />
              Segurança da Conta & 2FA (Dois Fatores)
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Proteja sua conta administrativa contra acessos não autorizados utilizando um aplicativo autenticador (Google Authenticator, Authy, etc.).
            </p>
          </div>
        </div>

        {/* Status do 2FA */}
        <div className="mt-6 border-t pt-6">
          {verifiedFactor ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-100 rounded-full text-emerald-700 mt-1">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-900 text-lg">2FA Ativado e Protegendo sua Conta</h3>
                    <p className="text-sm text-emerald-700 mt-1">
                      Cada login exigirá um código de 6 dígitos gerado pelo seu aplicativo autenticador.
                    </p>
                    <div className="mt-3 text-xs text-emerald-600 flex items-center gap-4">
                      <span><strong>Fator:</strong> {verifiedFactor.friendly_name || "Authenticator App"}</span>
                      <span><strong>Cadastrado em:</strong> {new Date(verifiedFactor.created_at).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
                  onClick={disable2FA}
                  disabled={unenrolling}
                >
                  {unenrolling ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Desativar 2FA
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 rounded-full text-amber-700 mt-1">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 text-lg">2FA Desativado (Recomendado Ativar)</h3>
                    <p className="text-sm text-amber-700 mt-1">
                      Sua conta está protegida apenas por e-mail e senha. Se a senha for comprometida, invasores podem alterar suas configurações.
                    </p>
                  </div>
                </div>
                {!isEnrolling && (
                  <Button
                    onClick={startEnrollment}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-medium"
                  >
                    <QrCode className="w-4 h-4 mr-2" /> Configurar 2FA Agora
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tela / Fluxo de Ativação do 2FA */}
      {isEnrolling && enrollData && (
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-amber-500 animate-in fade-in slide-in-from-bottom-4 space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-600" />
              Configurar Aplicativo Autenticador (Google Authenticator / Authy)
            </h3>
            <p className="text-sm text-gray-600">
              Siga os passos abaixo para vincular seu aplicativo autenticador.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Passo 1: QR Code */}
            <div className="space-y-3 text-center md:border-r md:pr-8">
              <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                Passo 1: Escanear QR Code
              </span>
              <p className="text-xs text-gray-600">
                Abra o <strong>Google Authenticator</strong> ou <strong>Authy</strong> no seu celular e escaneie a imagem abaixo:
              </p>
              <div className="p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg inline-block shadow-inner">
                {enrollData.qrCode ? (
                  <img
                    src={enrollData.qrCode}
                    alt="QR Code para Autenticação 2FA"
                    className="w-48 h-48 mx-auto"
                  />
                ) : (
                  <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto my-16" />
                )}
              </div>

              {/* Chave secreta manual */}
              <div className="mt-4 pt-4 border-t text-left">
                <Label className="text-xs text-gray-500 font-medium">Chave Secreta (Entrada Manual):</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    readOnly
                    value={enrollData.secret}
                    className="font-mono text-xs bg-gray-50"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copySecretToClipboard}
                    title="Copiar Chave Secreta"
                  >
                    {copiedSecret ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Passo 2: Código de Validação */}
            <div className="space-y-4">
              <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                Passo 2: Digitar Código de 6 Dígitos
              </span>
              <p className="text-sm text-gray-600">
                Insira o código numérico de 6 dígitos que aparece no seu aplicativo autenticador para confirmar a configuração:
              </p>

              <form onSubmit={confirmEnrollment} className="space-y-4">
                <div>
                  <Label htmlFor="code" className="text-sm font-medium text-gray-700">
                    Código TOTP de 6 dígitos
                  </Label>
                  <Input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                    className="text-center font-mono text-xl tracking-widest mt-1 h-12 border-amber-300 focus:border-amber-500"
                    autoFocus
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium"
                    disabled={verifying || verificationCode.length < 6}
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      "Confirmar e Ativar 2FA"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEnrollment}
                    disabled={verifying}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Dicas de Segurança Adicionais */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-blue-900">
        <h3 className="font-bold flex items-center gap-2 text-blue-950">
          <Info className="w-5 h-5 text-blue-600" />
          Recomendações Importantes de Segurança
        </h3>
        <ul className="mt-3 text-sm space-y-2 list-disc list-inside text-blue-800">
          <li>
            <strong>Guarde seu aplicativo autenticador:</strong> Caso troque de celular, certifique-se de transferir suas contas de 2FA.
          </li>
          <li>
            <strong>No Painel do Supabase:</strong> Em <em>Authentication &gt; Users</em>, clique no seu usuário e selecione <strong>Revoke Sessions</strong> se suspeitar que outra pessoa possui um token ativo.
          </li>
          <li>
            <strong>Senha Forte:</strong> Utilize senhas exclusivas e complexas com letras maiúsculas, números e símbolos especiais.
          </li>
        </ul>
      </div>
    </div>
  );
}
