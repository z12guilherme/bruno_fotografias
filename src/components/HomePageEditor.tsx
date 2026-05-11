import { useState, useEffect } from "react";
import { useHomepageContent, HomepageContent, TestimonialItem, CustomSectionItem } from "@/hooks/useHomepageContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2, Save, Eye, Upload, Image as ImageIcon,
  Trash2, Plus, ArrowUp, ArrowDown, Settings,
  User, BarChart, Film, MessageSquare, Phone, Info,
  Layout
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import brunoFallback from "@/assets/bruno.png";
import premiacaoFallback from "@/assets/premiacao.png";
import capaFallback from "@/assets/Capa.jpg";

import portfolio1 from "@/assets/portfolio1.jpg";
import portfolio2 from "@/assets/portfolio2.jpg";
import portfolio3 from "@/assets/portfolio3.jpg";
import portfolio4 from "@/assets/portfolio4.jpg";
import portfolio5 from "@/assets/portfolio5.jpg";
import portfolio6 from "@/assets/portfolio6.jpg";
import portfolio7 from "@/assets/portfolio7.jpg";
import portfolio8 from "@/assets/portfolio8.jpg";
import portfolio9 from "@/assets/portfolio9.jpg";

const defaultPortfolioImages = [
  portfolio1,
  portfolio2,
  portfolio3,
  portfolio4,
  portfolio5,
  portfolio6,
  portfolio7,
  portfolio8,
  portfolio9,
];

export function HomePageEditor() {
  const { content, loading, saveContent, setPreviewContent } = useHomepageContent();
  const [formData, setFormData] = useState<HomepageContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (content) {
      setFormData(JSON.parse(JSON.stringify(content))); // Deep clone to avoid direct mutation
    }
  }, [content]);

  if (loading || !formData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-amber-600" />
      </div>
    );
  }

  const handleChange = (section: keyof HomepageContent, field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: {
          ...(prev[section] as any),
          [field]: value,
        },
      };
    });
  };

  const handleCustomSectionChange = (index: number, field: keyof Omit<CustomSectionItem, 'id'>, value: string) => {
    setFormData(prev => {
      if (!prev) return prev;
      const newCustomSections = prev.customSections.map((section, i) => {
        if (i === index) {
          return { ...section, [field]: value };
        }
        return section;
      });
      return { ...prev, customSections: newCustomSections };
    });
  };

  const handleImageUpload = async (file: File, section: keyof HomepageContent, field: string, isArray = false, index?: number) => {
    const uploadId = isArray ? `${field}_${index}` : field;
    setUploadingImage(uploadId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `homepage_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `homepage/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      if (isArray && typeof index === 'number') {
        setFormData(prev => {
          if (!prev) return prev;
          let currentArray = [...(prev[section] as any)[field]];

          if (currentArray.length === 0 && section === 'portfolio' && field === 'imageUrls') {
            currentArray = [...defaultPortfolioImages];
          }

          currentArray[index] = publicUrl;
          return { ...prev, [section]: { ...(prev[section] as any), [field]: currentArray } };
        });
      } else if (isArray && index === undefined) {
        // Multi upload support
        setFormData(prev => {
          if (!prev) return prev;
          const currentArray = [...(prev[section] as any)[field], publicUrl];
          return { ...prev, [section]: { ...(prev[section] as any), [field]: currentArray } };
        });
      } else {
        handleChange(section, field, publicUrl);
      }

      toast({ title: "Imagem enviada com sucesso!" });
    } catch (error: any) {
      toast({ title: "Erro ao enviar imagem", description: error.message, variant: "destructive" });
    } finally {
      setUploadingImage(null);
    }
  };

  const handleCustomImageUpload = async (file: File, index: number) => {
    const uploadId = `custom_${index}`;
    setUploadingImage(uploadId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `homepage_custom_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `homepage/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      setFormData(prev => {
        if (!prev) return prev;
        const newCustomSections = (prev.customSections || []).map((section, i) => {
          if (i === index) {
            return { ...section, imageUrl: publicUrl };
          }
          return section;
        });
        return { ...prev, customSections: newCustomSections };
      });

      toast({ title: "Imagem enviada com sucesso!" });
    } catch (error: any) {
      toast({ title: "Erro ao enviar imagem", description: error.message, variant: "destructive" });
    } finally {
      setUploadingImage(null);
    }
  };

  const handleCustomGalleryUpload = async (files: FileList | null, sectionIndex: number) => {
    if (!files || files.length === 0) return;
    setUploadingImage(`custom_gallery_${sectionIndex}`);
    try {
      const urls: { url: string; description: string }[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `homepage_custom_gal_${Date.now()}_${i}.${fileExt}`;
        const filePath = `homepage/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio')
          .getPublicUrl(filePath);

        urls.push({ url: publicUrl, description: "" });
      }

      setFormData(prev => {
        if (!prev) return prev;
        const newCustomSections = [...prev.customSections];
        const currentGallery = newCustomSections[sectionIndex].gallery || [];
        newCustomSections[sectionIndex] = {
          ...newCustomSections[sectionIndex],
          gallery: [...currentGallery, ...urls]
        };
        return { ...prev, customSections: newCustomSections };
      });

      toast({ title: `${urls.length} imagens adicionadas com sucesso à galeria!` });
    } catch (error: any) {
      toast({ title: "Erro ao enviar imagens", description: error.message, variant: "destructive" });
    } finally {
      setUploadingImage(null);
    }
  };

  const handleCustomGalleryDescChange = (sectionIndex: number, imgIndex: number, value: string) => {
    setFormData(prev => {
      if (!prev) return prev;
      const newCustom = [...prev.customSections];
      const newGallery = [...(newCustom[sectionIndex].gallery || [])];
      newGallery[imgIndex] = { ...newGallery[imgIndex], description: value };
      newCustom[sectionIndex] = { ...newCustom[sectionIndex], gallery: newGallery };
      return { ...prev, customSections: newCustom };
    });
  };

  const moveCustomGalleryItem = (sectionIndex: number, imgIndex: number, direction: 'up' | 'down') => {
    setFormData(prev => {
      if (!prev) return prev;
      const newCustom = [...prev.customSections];
      const newGallery = [...(newCustom[sectionIndex].gallery || [])];
      const newIndex = direction === 'up' ? imgIndex - 1 : imgIndex + 1;
      if (newIndex < 0 || newIndex >= newGallery.length) return prev;

      const temp = newGallery[imgIndex];
      newGallery[imgIndex] = newGallery[newIndex];
      newGallery[newIndex] = temp;

      newCustom[sectionIndex] = { ...newCustom[sectionIndex], gallery: newGallery };
      return { ...prev, customSections: newCustom };
    });
  };

  const removeCustomGalleryItem = (sectionIndex: number, imgIndex: number) => {
    setFormData(prev => {
      if (!prev) return prev;
      const newCustom = [...prev.customSections];
      const newGallery = [...(newCustom[sectionIndex].gallery || [])];
      newGallery.splice(imgIndex, 1);
      newCustom[sectionIndex] = { ...newCustom[sectionIndex], gallery: newGallery };
      return { ...prev, customSections: newCustom };
    });
  };

  const handleMultiImageUpload = async (files: FileList | null) => {
    if (!files) return;
    setUploadingImage("portfolio_multi");
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `homepage_portfolio_${Date.now()}_${i}.${fileExt}`;
        const filePath = `homepage/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio')
          .getPublicUrl(filePath);

        urls.push(publicUrl);
      }

      setFormData(prev => {
        if (!prev) return prev;
        const newImageUrls = [...prev.portfolio.imageUrls, ...urls];
        return { ...prev, portfolio: { ...prev.portfolio, imageUrls: newImageUrls } };
      });

      toast({ title: `${urls.length} imagens enviadas com sucesso!` });
    } catch (error: any) {
      toast({ title: "Erro ao enviar imagens", description: error.message, variant: "destructive" });
    } finally {
      setUploadingImage(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await saveContent(formData);
    setIsSaving(false);
    if (success) {
      toast({ title: "Alterações salvas com sucesso!" });
    } else {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };

  const handlePreview = () => {
    setPreviewContent(formData);
    window.open("/?preview=true", "_blank");
  };

  // Reorder Functions
  const moveItem = (arrayField: keyof HomepageContent, index: number, direction: 'up' | 'down') => {
    const array = [...(formData[arrayField] as any)];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= array.length) return;

    const temp = array[index];
    array[index] = array[newIndex];
    array[newIndex] = temp;

    setFormData(prev => ({ ...prev!, [arrayField]: array }));
  };

  const moveDeepItem = (section: keyof HomepageContent, field: string, index: number, direction: 'up' | 'down') => {
    const array = [...(formData[section] as any)[field]];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= array.length) return;

    const temp = array[index];
    array[index] = array[newIndex];
    array[newIndex] = temp;

    handleChange(section, field, array);
  };

  return (
    <div className="space-y-6 max-w-5xl pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Editor da Página Inicial</h2>
          <p className="text-gray-500 text-sm">Gerencie todo o conteúdo e ordem das seções do seu site.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePreview} className="gap-2">
            <Eye className="w-4 h-4" /> Pré-visualizar
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-amber-600 hover:bg-amber-700 gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar Alterações
          </Button>
        </div>
      </div>

      <Accordion type="single" collapsible className="space-y-4">

        {/* Section: Hero */}
        <AccordionItem value="hero" className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-5 h-5 text-amber-600" />
              <span className="font-semibold">Capa (Hero)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Subtítulo da Capa</Label>
                  <Input
                    value={formData.hero.subtitle}
                    onChange={(e) => handleChange("hero", "subtitle", e.target.value)}
                    placeholder="Ex: Especialista em Fotografia de Parto"
                  />
                </div>
                <div>
                  <Label>Texto do Botão CTA</Label>
                  <Input
                    value={formData.hero.ctaText}
                    onChange={(e) => handleChange("hero", "ctaText", e.target.value)}
                    placeholder="Ex: Ver Portfólio"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label>Imagem de Fundo</Label>
                <div className="relative group aspect-video rounded-lg overflow-hidden border-2 border-dashed flex items-center justify-center bg-gray-50">
                  <>
                    <img src={formData.hero.backgroundImageUrl || capaFallback} alt="Hero Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Label htmlFor="hero_bg_upload" className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-md font-medium shadow-sm hover:bg-gray-100 transition-colors text-sm">
                        Alterar Imagem
                      </Label>
                      <Input
                        id="hero_bg_upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "hero", "backgroundImageUrl")}
                      />
                    </div>
                  </>
                  {uploadingImage === "backgroundImageUrl" && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                      <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                    </div>
                  )}
                </div>
                <Input
                  value={formData.hero.backgroundImageUrl || ""}
                  onChange={(e) => handleChange("hero", "backgroundImageUrl", e.target.value)}
                  placeholder="Ou cole a URL da imagem aqui"
                  className="text-xs"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section: Quem Sou */}
        <AccordionItem value="about" className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-amber-600" />
              <span className="font-semibold">Quem Sou (Sobre)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <Label>Título da Seção</Label>
                  <Input value={formData.about.title} onChange={(e) => handleChange("about", "title", e.target.value)} />
                </div>
                <div>
                  <Label>Parágrafo 1 (Bio Principal)</Label>
                  <Textarea value={formData.about.bio1} onChange={(e) => handleChange("about", "bio1", e.target.value)} rows={3} />
                </div>
                <div>
                  <Label>Parágrafo 2 (Trajetória)</Label>
                  <Textarea value={formData.about.bio2} onChange={(e) => handleChange("about", "bio2", e.target.value)} rows={3} />
                </div>
                <div>
                  <Label>Parágrafo 3 (Compromisso/Ética)</Label>
                  <Textarea value={formData.about.bio3} onChange={(e) => handleChange("about", "bio3", e.target.value)} rows={3} />
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <Label className="mb-2 block">Foto do Fotógrafo</Label>
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden border bg-gray-50 flex items-center justify-center group">
                    <img src={formData.about.photographerImageUrl || brunoFallback} alt="Bruno" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Label htmlFor="photographer_upload" className="cursor-pointer bg-white text-gray-900 px-3 py-1.5 rounded-md font-medium shadow-sm hover:bg-gray-100 transition-colors text-sm">
                        Trocar Foto
                      </Label>
                      <Input
                        id="photographer_upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "about", "photographerImageUrl")}
                      />
                    </div>
                    {uploadingImage === "photographerImageUrl" && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                        <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block">Foto da Premiação</Label>
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden border bg-gray-50 flex items-center justify-center group">
                    <img src={formData.about.awardImageUrl || premiacaoFallback} alt="Award" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Label htmlFor="award_upload" className="cursor-pointer bg-white text-gray-900 px-3 py-1.5 rounded-md font-medium shadow-sm hover:bg-gray-100 transition-colors text-sm">
                        Trocar Foto
                      </Label>
                      <Input
                        id="award_upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "about", "awardImageUrl")}
                      />
                    </div>
                    {uploadingImage === "awardImageUrl" && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                        <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section: Estatísticas */}
        <AccordionItem value="stats" className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex items-center gap-3">
              <BarChart className="w-5 h-5 text-amber-600" />
              <span className="font-semibold">Estatísticas</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 text-center border p-4 rounded-lg bg-gray-50/50">
                <Label className="text-amber-700 font-bold">Partos Registrados</Label>
                <Input
                  type="number"
                  className="text-center text-xl font-bold"
                  value={formData.stats.partos}
                  onChange={(e) => handleChange("stats", "partos", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2 text-center border p-4 rounded-lg bg-gray-50/50">
                <Label className="text-amber-700 font-bold">Anos de Experiência</Label>
                <Input
                  type="number"
                  className="text-center text-xl font-bold"
                  value={formData.stats.anosExperiencia}
                  onChange={(e) => handleChange("stats", "anosExperiencia", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2 text-center border p-4 rounded-lg bg-gray-50/50">
                <Label className="text-amber-700 font-bold">Prêmios Recebidos</Label>
                <Input
                  type="number"
                  className="text-center text-xl font-bold"
                  value={formData.stats.premios}
                  onChange={(e) => handleChange("stats", "premios", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section: Portfólio */}
        <AccordionItem value="portfolio" className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-5 h-5 text-amber-600" />
              <span className="font-semibold">Portfólio de Imagens</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label>Título do Portfólio</Label>
                <Input value={formData.portfolio.title} onChange={(e) => handleChange("portfolio", "title", e.target.value)} />
              </div>
              <div>
                <Label>Subtítulo do Portfólio</Label>
                <Input value={formData.portfolio.subtitle} onChange={(e) => handleChange("portfolio", "subtitle", e.target.value)} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-lg">Imagens ({formData.portfolio.imageUrls.length})</Label>
                <div className="relative">
                  <Input
                    id="portfolio_multi_upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleMultiImageUpload(e.target.files)}
                    disabled={uploadingImage === "portfolio_multi"}
                  />
                  <Label htmlFor="portfolio_multi_upload" className={`cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 gap-2 ${uploadingImage === "portfolio_multi" ? "opacity-50 pointer-events-none" : ""}`}>
                    {uploadingImage === "portfolio_multi" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Adicionar Imagens
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 border rounded-xl bg-gray-50">
                {formData.portfolio.imageUrls.length > 0 ? (
                  formData.portfolio.imageUrls.map((url, index) => (
                    <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border shadow-sm bg-white">
                      <img src={url} alt={`Portfolio ${index}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <div className="flex gap-1">
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => moveDeepItem("portfolio", "imageUrls", index, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => moveDeepItem("portfolio", "imageUrls", index, 'down')}
                            disabled={index === formData.portfolio.imageUrls.length - 1}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                          <Label htmlFor={`portfolio_replace_${index}`} className="cursor-pointer inline-flex items-center justify-center h-8 w-8 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80" title="Substituir imagem">
                            <Upload className="w-4 h-4" />
                          </Label>
                          <Input
                            id={`portfolio_replace_${index}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "portfolio", "imageUrls", true, index)}
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            const newUrls = [...formData.portfolio.imageUrls];
                            newUrls.splice(index, 1);
                            handleChange("portfolio", "imageUrls", newUrls);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {uploadingImage === `imageUrls_${index}` && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                          <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <>
                    <div className="col-span-full mb-2 text-center text-sm font-medium text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                      Mostrando imagens padrão (Fallback). Adicione suas próprias fotos para substituí-las no site.
                    </div>
                    {defaultPortfolioImages.map((url, index) => (
                      <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border shadow-sm bg-white opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all">
                        <img src={url} alt={`Fallback Portfolio ${index}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none group-hover:bg-black/60 transition-colors">
                          <span className="bg-black/60 text-white text-[10px] px-2 py-1 rounded uppercase tracking-wider font-bold group-hover:hidden">Padrão</span>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Label htmlFor={`fallback_upload_${index}`} className="cursor-pointer bg-white text-gray-900 px-3 py-1.5 rounded-md font-medium shadow-sm hover:bg-gray-100 transition-colors text-sm">
                            Substituir
                          </Label>
                          <Input
                            id={`fallback_upload_${index}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "portfolio", "imageUrls", true, index)}
                          />
                        </div>
                        {uploadingImage === `imageUrls_${index}` && (
                          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                            <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section: Vídeos */}
        <AccordionItem value="videos" className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex items-center gap-3">
              <Film className="w-5 h-5 text-amber-600" />
              <span className="font-semibold">Vídeos (Filmes)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Título da Seção</Label>
                <Input value={formData.videos.title} onChange={(e) => handleChange("videos", "title", e.target.value)} />
              </div>
              <div>
                <Label>Subtítulo da Seção</Label>
                <Input value={formData.videos.subtitle} onChange={(e) => handleChange("videos", "subtitle", e.target.value)} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>URLs do YouTube (Embed)</Label>
                <Button variant="outline" size="sm" onClick={() => {
                  const newUrls = [...formData.videos.urls, ""];
                  handleChange("videos", "urls", newUrls);
                }}>
                  <Plus className="w-4 h-4 mr-2" /> Adicionar Vídeo
                </Button>
              </div>

              <div className="space-y-3">
                {formData.videos.urls.map((url, index) => (
                  <div key={index} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg border">
                    <div className="flex flex-col gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveDeepItem("videos", "urls", index, 'up')} disabled={index === 0}>
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveDeepItem("videos", "urls", index, 'down')} disabled={index === formData.videos.urls.length - 1}>
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input
                        value={url}
                        onChange={(e) => {
                          const newUrls = [...formData.videos.urls];
                          newUrls[index] = e.target.value;
                          handleChange("videos", "urls", newUrls);
                        }}
                        placeholder="https://www.youtube.com/embed/..."
                      />
                      {url && url.includes('embed/') && (
                        <div className="text-[10px] text-gray-500 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" /> Preview disponível na Home
                        </div>
                      )}
                    </div>
                    <Button variant="destructive" size="icon" onClick={() => {
                      const newUrls = [...formData.videos.urls];
                      newUrls.splice(index, 1);
                      handleChange("videos", "urls", newUrls);
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section: Depoimentos */}
        <AccordionItem value="testimonials" className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-amber-600" />
              <span className="font-semibold">Depoimentos</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Título da Seção</Label>
                <Input value={formData.testimonials.title} onChange={(e) => handleChange("testimonials", "title", e.target.value)} />
              </div>
              <div>
                <Label>Subtítulo da Seção</Label>
                <Input value={formData.testimonials.subtitle} onChange={(e) => handleChange("testimonials", "subtitle", e.target.value)} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Lista de Depoimentos</Label>
                <Button variant="outline" size="sm" onClick={() => {
                  const newItem: TestimonialItem = { id: Date.now().toString(), name: "", text: "" };
                  const newItems = [...formData.testimonials.items, newItem];
                  handleChange("testimonials", "items", newItems);
                }}>
                  <Plus className="w-4 h-4 mr-2" /> Novo Depoimento
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.testimonials.items.map((item, index) => (
                  <div key={item.id} className="p-4 border rounded-xl bg-gray-50 space-y-3 relative group">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full"># {index + 1}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveDeepItem("testimonials", "items", index, 'up')} disabled={index === 0}>
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveDeepItem("testimonials", "items", index, 'down')} disabled={index === formData.testimonials.items.length - 1}>
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => {
                          const newItems = [...formData.testimonials.items];
                          newItems.splice(index, 1);
                          handleChange("testimonials", "items", newItems);
                        }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Input
                        placeholder="Nome do Cliente"
                        value={item.name}
                        onChange={(e) => {
                          const newItems = [...formData.testimonials.items];
                          newItems[index] = { ...item, name: e.target.value };
                          handleChange("testimonials", "items", newItems);
                        }}
                      />
                      <Textarea
                        placeholder="O depoimento..."
                        rows={3}
                        value={item.text}
                        onChange={(e) => {
                          const newItems = [...formData.testimonials.items];
                          newItems[index] = { ...item, text: e.target.value };
                          handleChange("testimonials", "items", newItems);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section: Contato */}
        <AccordionItem value="contact" className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-amber-600" />
              <span className="font-semibold">Contato e Redes</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Email Profissional</Label>
                  <Input value={formData.contact.email} onChange={(e) => handleChange("contact", "email", e.target.value)} />
                </div>
                <div>
                  <Label>WhatsApp (Somente números)</Label>
                  <Input value={formData.contact.whatsapp} onChange={(e) => handleChange("contact", "whatsapp", e.target.value)} placeholder="Ex: 5581999999999" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Instagram (@username)</Label>
                  <Input value={formData.contact.instagram} onChange={(e) => handleChange("contact", "instagram", e.target.value)} />
                </div>
                <div>
                  <Label>Texto de Disponibilidade</Label>
                  <Input value={formData.contact.availability} onChange={(e) => handleChange("contact", "availability", e.target.value)} />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Section: Rodapé */}
        <AccordionItem value="footer" className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-amber-600" />
              <span className="font-semibold">Rodapé (Footer)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Nome do Proprietário / Empresa</Label>
                  <Input value={formData.footer.ownerName} onChange={(e) => handleChange("footer", "ownerName", e.target.value)} />
                  <p className="text-[10px] text-gray-500 mt-1">Ex: Bruno José do Nascimento Silva</p>
                </div>
                <div>
                  <Label>CNPJ</Label>
                  <Input value={formData.footer.cnpj} onChange={(e) => handleChange("footer", "cnpj", e.target.value)} />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Texto de Direitos Reservados</Label>
                  <Input value={formData.footer.copyright} onChange={(e) => handleChange("footer", "copyright", e.target.value)} />
                </div>
                <div>
                  <Label>Créditos do Desenvolvedor</Label>
                  <Input value={formData.footer.developerCredit} onChange={(e) => handleChange("footer", "developerCredit", e.target.value)} />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SEÇÕES PERSONALIZADAS (Dinâmicas) */}
        {formData.customSections?.map((section, index) => (
          <AccordionItem key={section.id} value={`custom_${section.id}`} className="bg-white border border-amber-200 rounded-lg overflow-hidden shadow-sm">
            <AccordionTrigger className="px-6 hover:no-underline bg-amber-50/50">
              <div className="flex items-center gap-3">
                <Layout className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-amber-900">{section.title || "Nova Seção Personalizada"}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-4 space-y-6">
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm("Deseja mesmo excluir esta seção?")) {
                      const newCustoms = formData.customSections.filter(c => c.id !== section.id);
                      const newSections = formData.sections.filter(s => s !== `custom_${section.id}`);
                      setFormData({ ...formData, customSections: newCustoms, sections: newSections });
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Excluir Seção
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Título da Seção</Label>
                  <Input
                    value={section.title}
                    onChange={(e) => handleCustomSectionChange(index, 'title', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Subtítulo</Label>
                  <Input
                    value={section.subtitle}
                    onChange={(e) => handleCustomSectionChange(index, 'subtitle', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Texto Principal</Label>
                <Textarea
                  rows={5}
                  value={section.text}
                  onChange={(e) => handleCustomSectionChange(index, 'text', e.target.value)}
                />
              </div>
              <div>
                <Label className="mb-2 block font-medium">Imagem de Destaque (Opcional)</Label>
                <div className="relative aspect-video max-w-sm rounded-lg overflow-hidden border-2 border-dashed flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors group">
                  {section.imageUrl ? (
                    <>
                      <img src={section.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Label htmlFor={`custom_img_${index}`} className="cursor-pointer bg-white/20 hover:bg-white/40 text-white px-3 py-2 rounded-md font-medium backdrop-blur-sm transition-all shadow-sm text-sm">
                          Alterar
                        </Label>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => handleCustomSectionChange(index, 'imageUrl', '')}
                          title="Remover Imagem"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Input id={`custom_img_${index}`} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleCustomImageUpload(e.target.files[0], index)} />
                      </div>
                    </>
                  ) : (
                    <Label htmlFor={`custom_img_${index}`} className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-4">
                      <Upload className="w-8 h-8 text-gray-400 mb-2 group-hover:text-amber-600 transition-colors" />
                      <span className="text-sm font-medium text-gray-500 group-hover:text-amber-700 transition-colors">Clique para enviar foto</span>
                      <Input id={`custom_img_${index}`} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleCustomImageUpload(e.target.files[0], index)} />
                    </Label>
                  )}
                  {uploadingImage === `custom_${index}` && (
                    <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-10">
                      <Loader2 className="w-8 h-8 animate-spin text-amber-600 mb-2" />
                      <span className="text-sm font-bold text-amber-700">Enviando...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Galeria da Seção Personalizada */}
              <div className="pt-6 border-t mt-6">
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-lg font-medium">Galeria da Seção (Múltiplas imagens)</Label>
                  <div className="relative">
                    <Input
                      id={`custom_gallery_upload_${index}`}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleCustomGalleryUpload(e.target.files, index)}
                      disabled={uploadingImage === `custom_gallery_${index}`}
                    />
                    <Label htmlFor={`custom_gallery_upload_${index}`} className={`cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 gap-2 ${uploadingImage === `custom_gallery_${index}` ? "opacity-50 pointer-events-none" : ""}`}>
                      {uploadingImage === `custom_gallery_${index}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      Adicionar Imagens
                    </Label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(section.gallery || []).map((img, imgIndex) => (
                    <div key={imgIndex} className="relative group border rounded-lg bg-gray-50 overflow-hidden shadow-sm flex flex-col">
                      <div className="relative aspect-square">
                        <img src={img.url} alt="Gallery item" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => moveCustomGalleryItem(index, imgIndex, 'up')} disabled={imgIndex === 0}>
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => moveCustomGalleryItem(index, imgIndex, 'down')} disabled={imgIndex === (section.gallery?.length || 0) - 1}>
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => removeCustomGalleryItem(index, imgIndex)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-2">
                        <Input
                          placeholder="Descrição (Ex: Prêmio 2025)..."
                          value={img.description || ""}
                          onChange={(e) => handleCustomGalleryDescChange(index, imgIndex, e.target.value)}
                          className="h-8 text-sm bg-white"
                        />
                      </div>
                    </div>
                  ))}
                  {(!section.gallery || section.gallery.length === 0) && (
                    <div className="col-span-full py-6 text-center text-gray-400 italic text-sm">
                      Nenhuma imagem na galeria. Você pode adicionar várias fotos aqui.
                    </div>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}

        {/* Botão de Adicionar Seção Personalizada */}
        <div className="flex justify-center py-2">
          <Button variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-50" onClick={() => {
            const newId = Date.now().toString();
            const newSection: CustomSectionItem = { id: newId, title: "Nova Seção", subtitle: "", text: "" };
            setFormData({
              ...formData,
              customSections: [...(formData.customSections || []), newSection],
              sections: [...formData.sections, `custom_${newId}`]
            });
            toast({ title: "Nova seção adicionada! Edite os dados abaixo." });
          }}>
            <Plus className="w-4 h-4 mr-2" /> Adicionar Nova Seção (Ex: Premiações)
          </Button>
        </div>

        {/* Section: Ordem e Visibilidade */}
        <AccordionItem value="sections" className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <AccordionTrigger className="px-6 hover:no-underline">
            <div className="flex items-center gap-3">
              <Layout className="w-5 h-5 text-amber-600" />
              <span className="font-semibold">Organização da Página (Ordem)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2 space-y-4">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex items-start gap-3 mb-4">
              <Settings className="w-5 h-5 text-amber-600 mt-0.5" />
              <p className="text-sm text-amber-900">
                Arraste as seções (ou use os botões) para definir a ordem em que aparecem no site.
                Seções não listadas aqui não serão renderizadas.
              </p>
            </div>

            <div className="space-y-2">
              {formData.sections.map((section, index) => (
                <div key={section} className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm group hover:border-amber-400 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                      {index + 1}
                    </div>
                    <span className="font-medium uppercase tracking-wider text-sm">
                      {section === 'about' ? 'Quem Sou' :
                        section === 'stats' ? 'Estatísticas' :
                          section === 'portfolio' ? 'Portfólio' :
                            section === 'videos' ? 'Filmes/Vídeos' :
                              section === 'testimonials' ? 'Depoimentos' :
                                section === 'contact' ? 'Contato' :
                                  section === 'footer' ? 'Rodapé' :
                                    section.startsWith('custom_') ?
                                      (formData.customSections?.find(c => c.id === section.replace('custom_', ''))?.title || 'Seção Personalizada')
                                      : section}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveItem('sections', index, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveItem('sections', index, 'down')}
                      disabled={index === formData.sections.length - 1}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                      onClick={() => {
                        const newSections = [...formData.sections];
                        newSections.splice(index, 1);
                        setFormData({ ...formData, sections: newSections });
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Adicionar Seção que possa ter sido removida */}
              {[...['hero', 'about', 'stats', 'portfolio', 'videos', 'testimonials', 'contact', 'footer'], ...(formData.customSections || []).map(c => `custom_${c.id}`)].filter(s => !formData.sections.includes(s)).length > 0 && (
                <div className="pt-4 mt-4 border-t">
                  <Label className="mb-2 block text-xs uppercase text-gray-400">Adicionar Seção Oculta</Label>
                  <div className="flex flex-wrap gap-2">
                    {[...['hero', 'about', 'stats', 'portfolio', 'videos', 'testimonials', 'contact', 'footer'], ...(formData.customSections || []).map(c => `custom_${c.id}`)]
                      .filter(s => !formData.sections.includes(s))
                      .map(s => (
                        <Button
                          key={s}
                          variant="secondary"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            setFormData({ ...formData, sections: [...formData.sections, s] });
                          }}
                        >
                          <Plus className="w-3 h-3 mr-1" /> {s.startsWith('custom_') ? (formData.customSections?.find(c => c.id === s.replace('custom_', ''))?.title || 'Seção Personalizada') : s}
                        </Button>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
