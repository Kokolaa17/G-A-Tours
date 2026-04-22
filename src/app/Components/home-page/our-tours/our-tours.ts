import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-our-tours',
  imports: [TranslateModule],
  templateUrl: './our-tours.html',
  styleUrl: './our-tours.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OurTours {
  private readonly router = inject(Router);

  goToAllTours(){
    this.router.navigate(['finished-tours']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
