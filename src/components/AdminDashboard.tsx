import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FolderPlus, Upload, Folder, Image as ImageIcon, ArrowLeft, Settings } from "lucide-react";

interface Album {
  id: string;
  title: string;
  access_code: string;
  created_at: string;
}

interface Subfolder {
  id: string;
  title: string;
  album_id: string;
  created_at: string;
}

export const AdminDashboard = () => {
  const { toast } = useToast();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [subfolders, setSubfolders] = useState<Subfolder[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [newAlbumCode, setNewAlbumCode] = useState("");
  
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [currentSubfolder, setCurrentSubfolder] = useState<Subfolder | null>(null);
  
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, []);

  useEffect(() => {
    if (selectedAlbum) {
      fetchSubfolders(selectedAlbum.id);
      setCurrentSubfolder(null); // Resetar para a raiz do álbum ao trocar de álbum
    }
  }, [selectedAlbum]);

  const fetchAlbums = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("albums")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar álbuns",
        description: error.message,
      });
    } else {
      setAlbums(data || []);
    }
    setLoading(false);
  };

  const fetchSubfolders = async (albumId: string) => {
    const { data, error } = await supabase
      .from("subfolders")
      .select("*")
      .eq("album_id", albumId)
      .order("created_at", { ascending: true });

    if (!error) {
      setSubfolders(data || []);
    }
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumTitle || !newAlbumCode) return;

    setCreating(true);
    const { data, error } = await supabase
      .from("albums")
      .insert([{ title: newAlbumTitle, access_code: newAlbumCode }])
      .select()
      .single();

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar álbum",
        description: error.message,
      });
    } else {
      toast({
        title: "Álbum criado com sucesso!",
        description: `A pasta "${newAlbumTitle}" já está disponível.`,
      });
      setAlbums([data, ...albums]);
      setNewAlbumTitle("");
      setNewAlbumCode("");
    }
    setCreating(false);
  };

  const handleCreateSubfolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlbum || !newFolderName) return;

    setCreatingFolder(true);
    const { data, error } = await supabase
      .from("subfolders")
      .insert([{ 
        album_id: selectedAlbum.id, 
        title: newFolderName 
      }])
      .select()
      .single();

    if (error) {
      toast({ variant: "destructive", title: "Erro ao criar pasta", description: error.message });
    } else {
      setSubfolders([...subfolders, data]);
      setNewFolderName("");
      toast({ title: "Pasta criada com sucesso!" });
    }
    setCreatingFolder(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedAlbum || !e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const files = Array.from(e.target.files);
    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
      // Sanitizar nome do arquivo
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${selectedAlbum.id}/${fileName}`;

      // 1. Upload para o Storage (Bucket 'portfolio')
      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Erro no upload:", uploadError);
        errorCount++;
        continue;
      }

      // 2. Obter URL Pública
      const { data: { publicUrl } } = supabase.storage
        .from("portfolio")
        .getPublicUrl(filePath);

      // 3. Salvar referência no Banco de Dados
      const { error: dbError } = await supabase
        .from("photos")
        .insert([{
          album_id: selectedAlbum.id,
          subfolder_id: currentSubfolder?.id || null, // Vincula à pasta atual se houver
          image_url: publicUrl,
          title: file.name
        }]);

      if (dbError) {
        console.error("Erro ao salvar no banco:", dbError);
        errorCount++;
      } else {
        successCount++;
      }
    }

    setUploading(false);
    toast({
      title: "Processo finalizado",
      description: `${successCount} fotos enviadas. ${errorCount > 0 ? `${errorCount} falhas.` : ""}`,
      variant: errorCount > 0 ? "destructive" : "default",
    });
    
    // Limpar input
    e.target.value = "";
  };

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen bg-gray-50/50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
        <Button variant="outline" onClick={() => window.location.href = "/"}>Voltar ao Site</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna da Esquerda: Criar Álbum */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FolderPlus className="w-5 h-5 text-primary" /> Nova Pasta (Álbum)
              </CardTitle>
              <CardDescription>Crie uma área exclusiva para seu cliente.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAlbum} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Nome do Cliente / Evento</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Casamento Ana & Pedro"
                    value={newAlbumTitle}
                    onChange={(e) => setNewAlbumTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Senha de Acesso</Label>
                  <Input
                    id="code"
                    placeholder="Ex: anaepedro2024"
                    value={newAlbumCode}
                    onChange={(e) => setNewAlbumCode(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={creating}>
                  {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Criar Pasta"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Coluna da Direita: Lista e Upload */}
        <div className="lg:col-span-2 space-y-6">
          {/* Área de Gerenciamento do Álbum (Visível apenas quando um álbum é selecionado) */}
          {selectedAlbum && (
            <Card className="border-primary/50 shadow-md bg-primary/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Folder className="w-5 h-5 text-primary" /> 
                      {selectedAlbum.title} 
                      {currentSubfolder ? <span className="text-gray-400">/ {currentSubfolder.title}</span> : <span className="text-gray-400">/ Raiz</span>}
                    </CardTitle>
                    <CardDescription>
                      {currentSubfolder ? "Gerenciando subpasta" : "Gerenciando raiz do álbum"}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedAlbum(null)} className="text-xs">
                    Fechar Álbum
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Navegação e Criação de Pastas */}
                <div className="mb-6 space-y-4 border-b pb-6">
                  <div className="flex items-center gap-2">
                    {currentSubfolder && (
                      <Button variant="outline" size="sm" onClick={() => setCurrentSubfolder(null)}>
                        <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para Raiz
                      </Button>
                    )}
                    
                    {!currentSubfolder && (
                      <form onSubmit={handleCreateSubfolder} className="flex items-end gap-2 flex-1">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label htmlFor="folderName">Criar Nova Pasta</Label>
                          <div className="flex gap-2">
                            <Input 
                              id="folderName"
                              placeholder="Ex: Making Of, Cerimônia..." 
                              value={newFolderName}
                              onChange={(e) => setNewFolderName(e.target.value)}
                              className="bg-white"
                            />
                            <Button type="submit" disabled={creatingFolder}>
                              {creatingFolder ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderPlus className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Lista de Subpastas (só mostra se estiver na raiz) */}
                  {!currentSubfolder && subfolders.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {subfolders.map(folder => (
                        <Button 
                          key={folder.id} 
                          variant="outline" 
                          className="justify-start h-auto py-3 px-4 border-dashed border-2 hover:border-primary hover:bg-primary/5"
                          onClick={() => setCurrentSubfolder(folder)}
                        >
                          <Folder className="w-5 h-5 mr-2 text-amber-500" />
                          <span className="truncate">{folder.title}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Área de Upload */}
                <div className="mb-2 text-sm font-medium text-gray-700">
                  Adicionar fotos em: <span className="text-primary">{currentSubfolder ? currentSubfolder.title : "Raiz do Álbum"}</span>
                </div>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-xl p-10 bg-white hover:bg-gray-50 transition-colors text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="file-upload"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center w-full h-full">
                    {uploading ? (
                      <>
                        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                        <p className="text-lg font-medium text-gray-700">Enviando suas fotos...</p>
                        <p className="text-sm text-gray-500">Por favor, aguarde.</p>
                      </>
                    ) : (
                      <>
                        <div className="bg-primary/10 p-4 rounded-full mb-4">
                          <ImageIcon className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-lg font-medium text-gray-700">Clique para selecionar fotos</p>
                        <p className="text-sm text-gray-500 mt-1">Suporta JPG, PNG (Múltiplos arquivos)</p>
                      </>
                    )}
                  </label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de Álbuns */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="w-5 h-5 text-gray-500" /> Pastas Existentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" /></div>
              ) : albums.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Nenhuma pasta criada ainda.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {albums.map((album) => (
                    <div
                      key={album.id}
                      className={`
                        relative p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md
                        ${selectedAlbum?.id === album.id 
                          ? "border-primary bg-primary/5 ring-1 ring-primary" 
                          : "border-gray-200 bg-white hover:border-primary/50"}
                      `}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Folder className={`w-5 h-5 ${selectedAlbum?.id === album.id ? "text-primary" : "text-amber-500"}`} fill="currentColor" fillOpacity={0.2} />
                          <h3 className="font-semibold text-gray-800 truncate max-w-[150px]" title={album.title}>
                            {album.title}
                          </h3>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1 ml-7">
                        <p>Senha: <span className="font-mono bg-gray-100 px-1 rounded">{album.access_code}</span></p>
                        <p>Criado em: {new Date(album.created_at).toLocaleDateString("pt-BR")}</p>
                      </div>

                      <Button 
                        size="sm" 
                        className="w-full mt-4 gap-2" 
                        onClick={() => setSelectedAlbum(album)}
                      >
                        <Settings className="w-4 h-4" /> Gerenciar
                      </Button>
                      
                      {selectedAlbum?.id === album.id && (
                        <div className="absolute top-2 right-2">
                          <span className="flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};