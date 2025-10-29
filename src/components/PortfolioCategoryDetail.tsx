import { useParams } from "react-router-dom";

export const PortfolioCategoryDetail = () => {
  const { categoryName } = useParams<{ categoryName: string }>();

  // Placeholder data for images based on category
  const getCategoryImages = (category: string) => {
    switch (category) {
      case "partos":
        return [
          "https://images.unsplash.com/photo-1580130281322-29132945c74d?w=800",
          "https://images.unsplash.com/photo-1604881991720-f91add269612?w=600",
          "https://images.unsplash.com/photo-1519684351662-345efe642822?w=800",
        ];
      case "familia":
        return [
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800",
          "https://images.unsplash.com/photo-1484981138541-3d074aa97716?w=600",
          "https://images.unsplash.com/photo-1503640538444-a4334182331a?w=800",
          "https://images.unsplash.com/photo-1485965211009-5a4334143313?w=600",
          "https://images.unsplash.com/photo-1592731135593-35a9270939f0?w=800",
        ];
      case "batizados":
        return [
          "https://images.unsplash.com/photo-1542838132-350bf6847545?w=800",
          "https://images.unsplash.com/photo-1629528404391-932308b6a99f?w=600",
          "https://images.unsplash.com/photo-1589499093339-332370533777?w=800",
        ];
      case "eventos":
        return [
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
          "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600",
          "https://images.unsplash.com/photo-1519167758481-83f550bb49b6?w=800",
        ];
        case "casamentos":
        return [
          "https://images.unsplash.com/photo-1511285560921-4c92a495f426?w=800",
          "https://images.unsplash.com/photo-1597157639079-52413a340b41?w=600",
          "https://images.unsplash.com/photo-1523438885262-e535a1f42354?w=800",
          "https://images.unsplash.com/photo-1515934751635-481eff042b81?w=600",
          "https://images.unsplash.com/photo-1480797804128-520b5a58563a?w=800",
        ];
      default:
        return [];
    }
  };

  const images = getCategoryImages(categoryName || "");
  const formattedCategoryName = categoryName
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1).replace(/-/g, " ")
    : "Categoria";

  return (
    <section id="portfolio-detalhe" className="pt-32 pb-20 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">{formattedCategoryName}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Uma seleção de fotos incríveis da categoria {formattedCategoryName}.
          </p>
        </div>

        {images.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {images.map((image, index) => (
              <div key={index} className="break-inside-avoid">
                <img
                  src={image}
                  alt={`${formattedCategoryName} ${index + 1}`}
                  className="w-full h-auto object-cover rounded-lg shadow-lg"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-lg">Nenhuma imagem encontrada para esta categoria.</p>
        )}
      </div>
    </section>
  );
};