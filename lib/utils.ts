import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const getDominantColorFromImage = (
  imageUrl: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Permet de charger les images externes
    img.src = imageUrl;

    img.onload = () => {
      // Créer un canvas temporaire
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject("Failed to get canvas context");
        return;
      }

      // Définir la taille du canvas selon l'image
      canvas.width = img.width;
      canvas.height = img.height;

      // Dessiner l'image sur le canvas
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Récupérer les données des pixels
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Calculer la moyenne des couleurs (R, G, B)
      let r = 0,
        g = 0,
        b = 0,
        total = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i]; // Rouge
        g += data[i + 1]; // Vert
        b += data[i + 2]; // Bleu
        total++;
      }

      r = Math.floor(r / total);
      g = Math.floor(g / total);
      b = Math.floor(b / total);

      // Convertir en HEX
      const dominantColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      resolve(dominantColor);
    };

    img.onerror = () => {
      reject("Failed to load image");
    };
  });
};
