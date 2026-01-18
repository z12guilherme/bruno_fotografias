import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Upload, LogOut, FolderOpen, ArrowLeft, Pencil } from "lucide-react";

// Tipos para nossos dados
interface Album {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  access_code?: string;
  created_at: string;
}

interface Photo {
  id: string;
  image_url: string;
  title: string | null;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  
  // Estados do formulário
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [newAlbumCode, setNewAlbumCode] = useState("");
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [uploading, setUploading] = useState(false);

  // Verifica autenticação ao carregar
  useEffect(() => {
    checkUser();
    fetchAlbums();
  }, []);

  // Carrega fotos quando um álbum é selecionado
  useEffect(() => {
    if (selectedAlbum) {
      fetchPhotos(selectedAlbum.id);
    }
  }, [selectedAlbum]);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin/login");
      return;
    }
    // Opcional: Verificar role 'admin' novamente para segurança extra
    setLoading(false);
  }

  async function fetchAlbums() {
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error(error);
    else setAlbums(data || []);
  }

  async function fetchPhotos(albumId: string) {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('album_id', albumId)
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setPhotos(data || []);
  }

  async function handleSaveAlbum(e: React.FormEvent) {
    e.preventDefault();
    if (!newAlbumTitle || !newAlbumCode) {
      toast({ title: "Preencha o nome e a senha", variant: "destructive" });
      return;
    }

    if (editingAlbum) {
      // Modo de Edição
      const { error } = await supabase
        .from('albums')
        .update({ title: newAlbumTitle, access_code: newAlbumCode })
        .eq('id', editingAlbum.id);

      if (error) {
        toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Álbum atualizado!" });
        cancelEditing();
        fetchAlbums();
      }
    } else {
      // Modo de Criação
      const { error } = await supabase
        .from('albums')
        .insert([{ title: newAlbumTitle, access_code: newAlbumCode }]);

      if (error) {
        toast({ title: "Erro ao criar álbum", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Álbum criado com sucesso!" });
        setNewAlbumTitle("");
        setNewAlbumCode("");
        fetchAlbums();
      }
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !selectedAlbum) return;
    setUploading(true);

    const files = Array.from(e.target.files);
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${selectedAlbum.id}/${fileName}`;

      // 1. Upload para o Storage
      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Erro no upload:", uploadError);
        continue;
      }

      // 2. Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      // 3. Salvar referência no Banco de Dados
      await supabase.from('photos').insert({
        album_id: selectedAlbum.id,
        image_url: publicUrl,
        title: file.name
      });
    }

    setUploading(false);
    toast({ title: "Upload concluído!" });
    fetchPhotos(selectedAlbum.id);
  }

  async function handleDeletePhoto(photoId: string) {
    const { error } = await supabase.from('photos').delete().eq('id', photoId);
    if (error) {
      toast({ title: "Erro ao deletar", variant: "destructive" });
    } else {
      setPhotos(photos.filter(p => p.id !== photoId));
      toast({ title: "Foto removida" });
    }
  }

  async function handleDeleteAlbum(albumId: string) {
    if (!confirm("Tem certeza que deseja excluir este álbum? Todas as fotos serão perdidas.")) return;

    const { error } = await supabase.from('albums').delete().eq('id', albumId);
    if (error) {
      toast({ title: "Erro ao deletar álbum", description: error.message, variant: "destructive" });
    } else {
      setAlbums(albums.filter(a => a.id !== albumId));
      if (selectedAlbum?.id === albumId) setSelectedAlbum(null);
      toast({ title: "Álbum removido com sucesso" });
    }
  }

  function startEditing(album: Album) {
    setEditingAlbum(album);
    setNewAlbumTitle(album.title);
    setNewAlbumCode(album.access_code || "");
  }

  function cancelEditing() {
    setEditingAlbum(null);
    setNewAlbumTitle("");
    setNewAlbumCode("");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/admin/login");
  }

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>

        {!selectedAlbum ? (
          <div className="grid gap-8 md:grid-cols-2">
            {/* Seção Criar Álbum */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                {editingAlbum ? <Pencil className="mr-2 h-5 w-5" /> : <FolderOpen className="mr-2 h-5 w-5" />}
                {editingAlbum ? "Editar Álbum" : "Novo Cliente / Álbum"}
              </h2>
              <form onSubmit={handleSaveAlbum} className="space-y-4">
                <div>
                  <Label htmlFor="title">Nome do Cliente ou Título do Evento</Label>
                  <Input 
                    id="title" 
                    value={newAlbumTitle} 
                    onChange={e => setNewAlbumTitle(e.target.value)} 
                    placeholder="Ex: Casamento Maria & João" 
                  />
                </div>
                <div>
                  <Label htmlFor="code">Senha de Acesso (Cliente)</Label>
                  <Input 
                    id="code" 
                    value={newAlbumCode} 
                    onChange={e => setNewAlbumCode(e.target.value)} 
                    placeholder="Ex: mariajoao2024" 
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingAlbum ? "Salvar Alterações" : <><Plus className="mr-2 h-4 w-4" /> Criar Álbum</>}
                </Button>
                {editingAlbum && (
                  <Button type="button" variant="ghost" className="w-full" onClick={cancelEditing}>
                    Cancelar Edição
                  </Button>
                )}
              </form>
            </div>

            {/* Lista de Álbuns */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Álbuns Existentes</h2>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {albums.map(album => (
                  <div key={album.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border transition-colors">
                    <div className="flex flex-col overflow-hidden pr-4">
                      <span className="font-medium truncate">{album.title}</span>
                      <span className="text-xs text-gray-500 truncate">Senha: {album.access_code || "Sem senha"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="secondary" onClick={() => setSelectedAlbum(album)}>
                        Gerenciar
                      </Button>
                      <Button size="sm" variant="outline" className="px-2" onClick={() => startEditing(album)} title="Editar álbum">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" className="px-2" onClick={() => handleDeleteAlbum(album.id)} title="Excluir álbum">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {albums.length === 0 && <p className="text-gray-500 text-center py-4">Nenhum álbum criado ainda.</p>}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center mb-6">
              <Button variant="ghost" onClick={() => setSelectedAlbum(null)} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
              </Button>
              <h2 className="text-2xl font-bold">{selectedAlbum.title}</h2>
            </div>

            {/* Área de Upload */}
            <div className="mb-8 p-8 border-2 border-dashed border-gray-300 rounded-xl text-center bg-gray-50 hover:bg-gray-100 transition-colors">
              <Label htmlFor="upload" className="cursor-pointer block w-full h-full">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="h-12 w-12 text-gray-400 mb-3" />
                  <span className="text-lg font-medium text-gray-700">
                    {uploading ? "Enviando fotos..." : "Clique para fazer upload de fotos"}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">Suporta múltiplas imagens</span>
                </div>
                <Input 
                  id="upload" 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleUpload} 
                  disabled={uploading}
                />
              </Label>
            </div>

            {/* Grid de Fotos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {photos.map(photo => (
                <div key={photo.id} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                  <img src={photo.image_url} alt={photo.title || ""} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="destructive" size="icon" onClick={() => handleDeletePhoto(photo.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {photos.length === 0 && !uploading && (
                <div className="col-span-full text-center py-10 text-gray-500">
                  Este álbum ainda não tem fotos.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}