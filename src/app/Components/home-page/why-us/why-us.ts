import { AfterViewInit, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-why-us',
  imports: [TranslateModule],
  templateUrl: './why-us.html',
  styleUrl: './why-us.scss',
})
export class WhyUs implements AfterViewInit {
  ngAfterViewInit() {
    // Scroll reveal
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    reveals.forEach(r => observer.observe(r));

    // Nav active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach((s: any) => {
        if (window.scrollY >= s.offsetTop - 100) current = s.id;
      });
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + current) a.classList.add('active');
      });
    });
  }
}
