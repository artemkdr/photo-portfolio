export function fetchDummyPhotos() {
    const images = [];
    for (let i = 0; i < 500; i++) {
        images.push({
            src: `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="hsl(${Math.floor(Math.random() * 360)}, 80%, 40%)" width="100" height="100"%3E%3C/rect%3E%3C/svg%3E`,
            previewSrc: `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="hsl(${Math.floor(Math.random() * 360)}, 80%, 40%)" width="20" height="20"%3E%3C/rect%3E%3C/svg%3E`,
            alt: `Photo ${i}`,
            name: `photo${i}.svg`,
            created: new Date(),
        });
    }
    return images;
}
