/** Replaces a broken <img> with a text placeholder so cards never show a broken-image icon. */
export function showImageFallback(event: Event, label: string): void {
  const image = event.target as HTMLImageElement;
  image.style.display = 'none';
  const parent = image.parentElement;
  if (parent && !parent.querySelector('.image-fallback')) {
    const fallback = document.createElement('div');
    fallback.className = 'image-fallback';
    fallback.textContent = label;
    parent.appendChild(fallback);
  }
}
