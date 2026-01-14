const galleryContainer = document.getElementById('image-gallery');
const totalImages = 464;
let galleryHTML = '';
for (let i = 1; i <= totalImages; i++) {
    galleryHTML += `<img src="./img/galerie/image${i}.jpg" alt="Poza ${i}">\n`;
}
galleryContainer.innerHTML = galleryHTML;