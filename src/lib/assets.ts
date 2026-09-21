/** Roosa images use descriptive filenames and measured intrinsic dimensions. */

export type Asset = { src: string; width: number; height: number; alt: string };

const img = (file: string, width: number, height: number, alt: string): Asset => ({
  src: `/assets/images/${file}`,
  width,
  height,
  alt,
});

export const brand = {
  logo: img("TMy9qsq8JrSSPJkrrWd3SfwnDbU-810befb1.png", 310, 73, "Roosa"),
  logoLarge: img("TMy9qsq8JrSSPJkrrWd3SfwnDbU-399e2296.png", 1311, 311, "Roosa"),
  favicon: "/brand/roosa-favicon.svg",
  ogImage: "/assets/icons/roosa-social-preview.webp",
};

export const home = {
  hero: img("roosa-pink-roll-hero.webp", 3344, 1882, "Hand holding pink roll against pink background"),
  forest: img("roosa-blossom-landscape.webp", 1672, 941, "Flowering trees against blue sky"),
  routine: img("roosa-home-routine.webp", 1672, 941, "Woman holding pink roll at home"),
  tennis: img("roosa-roll-on-court.webp", 1448, 1086, "Pink roll on running track"),
  habits: img("roosa-pink-roll-in-hand.webp", 1009, 1558, "Hand holding a pink roll"),
  focus: img("roosa-roll-on-pink-background.webp", 1402, 1122, "Pink ROOSA roll on pink background"),
  simplicity: img("roosa-pink-silk-background.webp", 1806, 871, "Pink fabric background"),
  testimonialBg: img("roosa-blossom-canopy.webp", 941, 1672, "Flowering trees and sky"),
  closing: img("roosa-roll-in-flower-meadow.webp", 1249, 974, "Pink roll among flowers"),
  grassWide: img("roosa-pink-roll-meadow.webp", 1249, 974, "Pink roll in a flower meadow"),
  editorial: img("roosa-garden-table.webp", 1024, 1536, "Outdoor table beneath flowering trees"),
  lab: img("roosa-pink-roll-hero.webp", 3344, 1882, "Hand holding pink roll against pink background"),
  grass: img("roosa-pink-roll-meadow.webp", 1249, 974, "Pink roll in a flower meadow"),
  wide: img("rt7EhbM0b89GV3Exm5VCRoV728Q-b752c6c3.png", 1376, 802, "Formula composition"),
  bloom: img("roosa-flower-meadow.webp", 1672, 941, "Pink flowering meadow"),
  hand: img("roosa-woman-holding-roll.webp", 1448, 1086, "Woman holding a pink roll"),
  routinePanel: img("roosa-home-routine.webp", 1672, 941, "Woman holding pink roll at home"),
  offer: img("roosa-pink-roll-product.webp", 1254, 1254, "Pink roll product"),
  gummyOrange: img("roosa-white-rolls-stacked.webp", 1122, 1402, "Stack of white rolls"),
  gummyGreen: img("roosa-pink-roll-studio.webp", 1254, 1254, "Pink roll on white background"),
  carouselFloralLeft: img("roosa-carousel-floral-roll-left.png", 1086, 1448, "Floral line illustration with toilet paper"),
  carouselFloralRight: img("roosa-carousel-floral-roll-right.png", 1086, 1448, "Floral line illustration"),
  tall: img("roosa-garden-table.webp", 1024, 1536, "Outdoor table beneath flowering trees"),
};

/** The five ingredient tiles, rendered at 433x311 with a 25px radius. */
export const ingredientTiles: Asset[] = [
  img("roosa-quality-supersoft-texture.webp", 1672, 941, "Weiche Struktur des ROOSA Toilettenpapiers"),
  img("roosa-quality-strong-layers.webp", 1672, 941, "Stabile Lagen des ROOSA Toilettenpapiers"),
  img("roosa-quality-everyday-bathroom.webp", 1672, 941, "ROOSA im Badezimmer"),
  img("roosa-quality-responsible-delivery.webp", 1672, 941, "Verantwortungsvolle ROOSA Lieferung"),
  img("roosa-quality-child-protection.webp", 1672, 941, "ROOSA unterstützt Kinderschutz"),
];

/** Testimonial avatars, rendered at 38x38. */
export const avatars: Asset[] = [
  img("3mLfQfij30V2vXZQlhJahQXd6pE-49838306.png", 212, 212, "Portrait"),
  img("ETp8i5L0SrDazw7KxDQnuv1xOd8-84d5bbc9.png", 212, 212, "Portrait"),
  img("iZWn3lnx4kC7XZcyHtCUdJaqXKI-1b52dc78.png", 212, 212, "Portrait"),
  img("RxOPn618LEzzdCodJGsQRhGgZI-91ad8922.png", 212, 212, "Portrait"),
  img("YPWBXJfRHoM8i2RaXlMZcmrPZv8-89eca0c9.png", 212, 212, "Portrait"),
  img("MIbXl4tKIc4HU6AbbtAk0QG2riY-5a3d87d0.png", 55, 56, "Portrait"),
];

export const science = {
  hero: img("roosa-spring-canopy.webp", 1672, 941, "Spring flowers against blue sky"),
  hero2: img("roosa-portrait-holding-rolls.webp", 1671, 941, "Person holding two pink rolls"),
  wide: img("roosa-roll-in-flower-meadow.webp", 1249, 974, "Pink roll among flowers"),
};

/** Product shot per merch slug. */
export const productImages: Record<string, Asset> = {
  "toilettenpapier-rosa": img("roosa-pink-roll-product.webp", 1254, 1254, "ROOSA Toilettenpapier Rosa"),
  "toilettenpapier-weiss": img("roosa-white-roll-product.webp", 1254, 1254, "ROOSA Toilettenpapier Weiss"),
};

/** Product shot per flavour, where a product has them. */
export const flavourImages: Record<string, Asset> = {
  Rosa: img("roosa-pink-roll-product.webp", 1254, 1254, "ROOSA Toilettenpapier Rosa"),
  Weiss: img("roosa-white-roll-product.webp", 1254, 1254, "ROOSA Toilettenpapier Weiss"),
};

export const productGalleries: Record<string, Asset[]> = {
  Rosa: [
    productImages["toilettenpapier-rosa"],
    img("roosa-pink-rolls-stacked.webp", 1122, 1402, "Rosa Rollen gestapelt"),
  ],
  Weiss: [
    productImages["toilettenpapier-weiss"],
    img("roosa-white-rolls-stacked.webp", 1122, 1402, "Weisse Rollen gestapelt"),
  ],
};

/** Editorial image per blog slug. */
export const postImages: Record<string, Asset> = {
  "kinderschutz-gemeinsam-staerken": img("roosa-portrait-holding-rolls.webp", 1671, 941, "Person holding ROOSA rolls"),
  "kleine-rolle-grosse-wirkung": img("roosa-roll-in-flower-meadow.webp", 1249, 974, "ROOSA roll among flowers"),
  "supersoft-mit-herz": img("roosa-woman-with-roll.webp", 1678, 937, "Woman with ROOSA roll"),
};

export const authorAvatar = img("MIbXl4tKIc4HU6AbbtAk0QG2riY-5a3d87d0.png", 55, 56, "Author portrait");
