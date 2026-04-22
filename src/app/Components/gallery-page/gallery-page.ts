import { Component } from '@angular/core';

@Component({
  selector: 'app-gallery-page',
  imports: [],
  templateUrl: './gallery-page.html',
  styleUrl: './gallery-page.scss',
})
export class GalleryPage {
    galleryItems = [
    { src: 'https://scontent.ftbs5-4.fna.fbcdn.net/v/t39.30808-6/676203630_122322410276007629_3204502505514564512_n.jpg?stp=cp6_dst-jpegr_tt6&_nc_cat=101&ccb=1-7&_nc_sid=7b2446&_nc_ohc=GZIS7ffEBLoQ7kNvwFtV9US&_nc_oc=AdrX56rI2mgWbCJIhfTQSE1SWzLCdpnvm8uW4Zj2oODO2Cq8uoRnhI2ys9t0si8uYHs&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-4.fna&_nc_gid=CDuoAJLtnGl3A5SFFYt69A&_nc_ss=7a3a8&oh=00_Af0H2po8AHXK8fM9diJ3y4jczxi39UKhdaeq_-DVy8Iuvw&oe=69EEF88F', location: 'Garni, Armenia', name: 'Temple of Garni' },
    { src: 'https://scontent.ftbs5-2.fna.fbcdn.net/v/t39.30808-6/678233317_122322410234007629_8750708560516332248_n.jpg?stp=cp6_dst-jpegr_tt6&_nc_cat=108&ccb=1-7&_nc_sid=7b2446&_nc_ohc=GH6xEAUTg9cQ7kNvwH8knip&_nc_oc=AdokSv82RijzhLy1eaS1baMsaycnHs35RfMM6GDAe-5gSrmAtzG8mwi7QcZWo5USwiQ&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-2.fna&_nc_gid=FwSw0KHIG9s5sHkD6nuNZQ&_nc_ss=7a2a8&oh=00_Af3262T9mmMjR_vCcoitMFugqOY1r7tQWgV-Z1JZ-UUPCg&oe=69EF0A79', location: 'Trabzon, Turkey', name: 'Trabzon Akvaryum' },
    { src: 'https://scontent.ftbs5-3.fna.fbcdn.net/v/t39.30808-6/674085936_122322119672007629_8173455753457845470_n.jpg?stp=cp6_dst-jpegr_tt6&_nc_cat=106&ccb=1-7&_nc_sid=7b2446&_nc_ohc=RACnGHnsRSIQ7kNvwEByZro&_nc_oc=AdoS6na3Uh1oXt4DLcbGFWrLiEWAcIoSFkyrj8IdM9gZYF3Hvj13MgQMWuXdQDVjQ_0&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-3.fna&_nc_gid=kfGfX8hffmCE4w3EjeW3rw&_nc_ss=7a3a8&oh=00_Af2x-EAWALUQwBn6WFTlYL9tZ-ncncK-eUm5IYL-PRM_0g&oe=69EF0176', location: 'Kakheti Wine Country', name: '8,000 years of winemaking' },
    { src: 'https://scontent.ftbs5-2.fna.fbcdn.net/v/t39.30808-6/677017362_122322119630007629_2272974931926245165_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=103&ccb=1-7&_nc_sid=7b2446&_nc_ohc=NxafsUazZWsQ7kNvwFzzQpl&_nc_oc=AdqfUICPmhFsxzorbAaei5gaUsRgaJu6EyHrhKCPMRJg1GYvoXorTytrDFgTY8Ii3ak&_nc_zt=23&_nc_ht=scontent.ftbs5-2.fna&_nc_gid=x97-d1-wOfnhi-PEPgeWiA&_nc_ss=7b2a8&oh=00_Af07ptrwIED8XDobqWNgbLB2uYS6yh6DTSsrUiVk-MrYpA&oe=69EF03DA', location: 'Kazbegi Mountains', name: 'The roof of the Caucasus' },
    { src: 'https://scontent.ftbs5-4.fna.fbcdn.net/v/t39.30808-6/674090246_122322119546007629_8555141254738478409_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=101&ccb=1-7&_nc_sid=7b2446&_nc_ohc=GgUOydk7d1YQ7kNvwHw-Ffo&_nc_oc=AdrJAI1ObAQjIo5Cg422vBG_mLt3wzlht0XbIryepj1CexH1k047Ujigy5trfGcZs20&_nc_zt=23&_nc_ht=scontent.ftbs5-4.fna&_nc_gid=Y6vEOIdz0OQbDX66svHejA&_nc_ss=7a2a8&oh=00_Af0tb2AALYjvlhEcIAEhMXLnRMPdFXdTui97YZtu3-MhiQ&oe=69EEE44E', location: 'Uzungöl, Turkey', name: 'Uzungöl lake' },
  ];

  selectedImage: { src: string; title: string; subtitle: string } | null = null;

  openLightbox(src: string, title: string, subtitle: string) {
    this.selectedImage = { src, title, subtitle };
  }

  closeLightbox() {
    this.selectedImage = null;
  }
}
