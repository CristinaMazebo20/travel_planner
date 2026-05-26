// shared/components/footer/footer.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="footer-glow"></div>
      <div class="container">
        <div class="footer-content">
          <!-- Logo e descrição -->
          <div class="footer-brand">
            <div class="logo">
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
                <path d="M16 2L20 8H12L16 2Z" fill="url(#gradient)"/>
                <path d="M16 30L12 24H20L16 30Z" fill="url(#gradient)"/>
                <rect x="14" y="8" width="4" height="16" fill="url(#gradient)"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#6C3BD4"/>
                    <stop offset="100%" style="stop-color:#00D9FF"/>
                  </linearGradient>
                </defs>
              </svg>
              <span>Travel<span>ly</span></span>
            </div>
            <p>{{ i18n.t('footer.descricao') }}</p>
            <div class="social-links">
              <a href="#" class="social">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" class="social">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="4" ry="4"/>
                  <circle cx="12" cy="12" r="4"/>
                  <line x1="17" y1="7" x2="17.01" y2="7"/>
                </svg>
              </a>
              <a href="#" class="social">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              <a href="#" class="social">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Links rápidos - Destinos -->
          <div class="footer-links">
            <h4>{{ i18n.t('footer.destinos') }}</h4>
            <ul>
              <li><a href="#">
                <svg class="link-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="3"/>
                </svg>
                {{ i18n.t('footer.europa') }}
              </a></li>
              <li><a href="#">
                <svg class="link-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M3 9L12 3L21 9L12 15L3 9Z"/>
                  <path d="M12 15V21M9 18H15" stroke="currentColor"/>
                </svg>
                {{ i18n.t('footer.america_sul') }}
              </a></li>
              <li><a href="#">
                <svg class="link-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M2 12L7 7M22 12L17 7M12 2V7M12 22V17M7 12H2M22 12H17M7 12L12 17M17 12L12 17" stroke="currentColor"/>
                </svg>
                {{ i18n.t('footer.asia') }}
              </a></li>
              <li><a href="#">
                <svg class="link-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12H22M12 2C9 5 9 19 12 22" stroke="currentColor"/>
                </svg>
                {{ i18n.t('footer.africa') }}
              </a></li>
            </ul>
          </div>

          <!-- Links rápidos - Suporte -->
          <div class="footer-links">
            <h4>{{ i18n.t('footer.suporte') }}</h4>
            <ul>
              <li><a href="#">
                <svg class="link-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4M12 16h.01"/>
                </svg>
                {{ i18n.t('footer.central_ajuda') }}
              </a></li>
              <li><a href="#">
                <svg class="link-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                {{ i18n.t('footer.termos_uso') }}
              </a></li>
              <li><a href="#">
                <svg class="link-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                {{ i18n.t('footer.politica_privacidade') }}
              </a></li>
              <li><a href="#">
                <svg class="link-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M22 2L15 9M22 2l-7 7M22 2v6M22 2h-6"/>
                  <path d="M4 4L20 4C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                {{ i18n.t('footer.contato') }}
              </a></li>
            </ul>
          </div>

          <!-- Newsletter -->
          <div class="footer-links">
            <h4>
              <svg class="section-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M22 7L12 13L2 7"/>
              </svg>
              {{ i18n.t('footer.newsletter') }}
            </h4>
            <p class="newsletter-text">{{ i18n.t('footer.newsletter_texto') }}</p>
            <div class="newsletter-form">
              <input type="email" [placeholder]="i18n.t('footer.email_placeholder')">
              <button>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
            <div class="payment-methods">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                <rect x="2" y="5" width="20" height="14" rx="2" ry="2"/>
                <line x1="2" y1="10" x2="22" y2="10"/>
                <circle cx="7.5" cy="15.5" r="1.5"/>
                <circle cx="16.5" cy="15.5" r="1.5"/>
              </svg>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M4 4L20 20" stroke="currentColor"/>
                <path d="M20 4L4 20" stroke="currentColor"/>
              </svg>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                <rect x="2" y="6" width="20" height="12" rx="2"/>
                <path d="M8 12H16" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="17" cy="12" r="2"/>
              </svg>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                <rect x="4" y="5" width="16" height="14" rx="2"/>
                <path d="M9 9h6M9 12h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© {{ ano }} Travelly. {{ i18n.t('footer.copyright') }}</p>
          <div class="footer-badges">
            <span class="badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12H22M12 2C14.5 4.5 15.5 8 12 12C8.5 8 9.5 4.5 12 2Z"/>
              </svg>
              {{ i18n.t('footer.badge_destinos') }}
            </span>
            <span class="badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              {{ i18n.t('footer.badge_avaliacao') }}
            </span>
            <span class="badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              {{ i18n.t('footer.badge_seguro') }}
            </span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      position: relative;
      background: linear-gradient(180deg, #0A0F2E 0%, #050816 100%);
      margin-top: 80px;
      padding: 60px 0 30px;
      border-top: 1px solid rgba(0,217,255,0.1);
      overflow: hidden;
    }

    .footer-glow {
      position: absolute;
      top: -50%;
      left: -20%;
      width: 140%;
      height: 200%;
      background: radial-gradient(ellipse at center, rgba(108,59,212,0.15) 0%, transparent 60%);
      pointer-events: none;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
      position: relative;
      z-index: 1;
    }

    .footer-content {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.5fr;
      gap: 40px;
      margin-bottom: 50px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
    }

    .logo span {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #fff 0%, #6C3BD4 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .logo span span {
      color: #00D9FF;
      background: none;
      -webkit-background-clip: unset;
      background-clip: unset;
    }

    .footer-brand p {
      color: #A0A8C6;
      line-height: 1.6;
      margin-bottom: 20px;
      font-size: 0.9rem;
    }

    .social-links {
      display: flex;
      gap: 12px;
    }

    .social {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.05);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      color: #A0A8C6;
      transition: all 0.3s;
      border: 1px solid rgba(255,255,255,0.1);
    }

    .social svg {
      stroke: currentColor;
    }

    .social:hover {
      background: linear-gradient(135deg, #6C3BD4, #00D9FF);
      color: white;
      transform: translateY(-3px);
    }

    .footer-links h4 {
      color: white;
      font-size: 1.1rem;
      margin-bottom: 20px;
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .footer-links h4::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 0;
      width: 30px;
      height: 2px;
      background: linear-gradient(90deg, #6C3BD4, #00D9FF);
    }

    .section-icon {
      stroke: #00D9FF;
    }

    .footer-links ul {
      list-style: none;
      padding: 0;
    }

    .footer-links li {
      margin-bottom: 12px;
    }

    .footer-links a {
      color: #A0A8C6;
      text-decoration: none;
      transition: color 0.3s;
      font-size: 0.9rem;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .link-icon {
      stroke: #6C3BD4;
      transition: stroke 0.3s;
    }

    .footer-links a:hover {
      color: #00D9FF;
    }

    .footer-links a:hover .link-icon {
      stroke: #00D9FF;
    }

    .newsletter-text {
      color: #A0A8C6;
      font-size: 0.85rem;
      margin-bottom: 15px;
    }

    .newsletter-form {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .newsletter-form input {
      flex: 1;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 30px;
      padding: 12px 16px;
      color: white;
      font-size: 0.9rem;
    }

    .newsletter-form input:focus {
      outline: none;
      border-color: #00D9FF;
    }

    .newsletter-form input::placeholder {
      color: #6B7280;
    }

    .newsletter-form button {
      background: linear-gradient(135deg, #6C3BD4, #00D9FF);
      border: none;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      cursor: pointer;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s;
    }

    .newsletter-form button:hover {
      transform: translateX(3px);
    }

    .payment-methods {
      display: flex;
      gap: 12px;
    }

    .payment-methods svg {
      stroke: #A0A8C6;
      transition: all 0.3s;
    }

    .payment-methods svg:hover {
      stroke: #00D9FF;
      transform: translateY(-2px);
    }

    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 25px;
      border-top: 1px solid rgba(255,255,255,0.05);
      flex-wrap: wrap;
      gap: 15px;
    }

    .footer-bottom p {
      color: #6B7280;
      font-size: 0.85rem;
    }

    .footer-badges {
      display: flex;
      gap: 15px;
    }

    .badge {
      background: rgba(255,255,255,0.03);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      color: #A0A8C6;
      border: 1px solid rgba(0,217,255,0.2);
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    @media (max-width: 1024px) {
      .footer-content {
        grid-template-columns: 1fr 1fr;
        gap: 40px;
      }
    }

    @media (max-width: 640px) {
      .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
      }
      .footer-links h4::after {
        left: 50%;
        transform: translateX(-50%);
      }
      .footer-links h4 {
        justify-content: center;
      }
      .social-links {
        justify-content: center;
      }
      .newsletter-form {
        max-width: 300px;
        margin: 0 auto 20px;
      }
      .payment-methods {
        justify-content: center;
      }
      .footer-bottom {
        flex-direction: column;
        text-align: center;
      }
      .footer-badges {
        justify-content: center;
      }
    }

    /* Light Mode - Footer */
    body.light-theme .footer {
      background: linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%);
      border-top-color: #E2E8F0;
    }

    body.light-theme .footer-glow {
      background: radial-gradient(ellipse at center, rgba(108,59,212,0.05) 0%, transparent 60%);
    }

    body.light-theme .footer-brand p {
      color: #64748B;
    }

    body.light-theme .footer-links h4 {
      color: #1E293B;
    }

    body.light-theme .footer-links a {
      color: #64748B;
    }

    body.light-theme .footer-links a:hover {
      color: #3B82F6;
    }

    body.light-theme .footer-links a:hover .link-icon {
      stroke: #3B82F6;
    }

    body.light-theme .newsletter-text {
      color: #64748B;
    }

    body.light-theme .newsletter-form input {
      background: #FFFFFF;
      border-color: #E2E8F0;
      color: #1E293B;
    }

    body.light-theme .newsletter-form input::placeholder {
      color: #94A3B8;
    }

    body.light-theme .social {
      background: #FFFFFF;
      border-color: #E2E8F0;
      color: #64748B;
    }

    body.light-theme .social:hover {
      background: linear-gradient(135deg, #6C3BD4, #3B82F6);
      color: white;
    }

    body.light-theme .badge {
      background: #FFFFFF;
      border-color: #E2E8F0;
      color: #64748B;
    }

    body.light-theme .payment-methods svg {
      stroke: #64748B;
    }

    body.light-theme .payment-methods svg:hover {
      stroke: #3B82F6;
    }

    body.light-theme .footer-bottom p {
      color: #94A3B8;
    }

    body.light-theme .footer-bottom {
      border-top-color: #E2E8F0;
    }
  `]
})
export class FooterComponent {
  ano = new Date().getFullYear();

  constructor(public i18n: I18nService) {}
}