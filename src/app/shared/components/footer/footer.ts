import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
            <p>Descubra o mundo com estilo e conforto. Planeje suas viagens de forma inteligente.</p>
            <div class="social-links">
              <a href="#" class="social">📘</a>
              <a href="#" class="social">📷</a>
              <a href="#" class="social">🐦</a>
              <a href="#" class="social">💬</a>
            </div>
          </div>

          <!-- Links rápidos -->
          <div class="footer-links">
            <h4>Destinos</h4>
            <ul>
              <li><a href="#">Europa</a></li>
              <li><a href="#">América do Sul</a></li>
              <li><a href="#">Ásia</a></li>
              <li><a href="#">África</a></li>
            </ul>
          </div>

          <div class="footer-links">
            <h4>Suporte</h4>
            <ul>
              <li><a href="#">Central de Ajuda</a></li>
              <li><a href="#">Termos de Uso</a></li>
              <li><a href="#">Política de Privacidade</a></li>
              <li><a href="#">Contato</a></li>
            </ul>
          </div>

          <div class="footer-links">
            <h4>Newsletter</h4>
            <p class="newsletter-text">Receba ofertas exclusivas</p>
            <div class="newsletter-form">
              <input type="email" placeholder="Seu melhor email">
              <button>→</button>
            </div>
            <div class="payment-methods">
              <span>💳</span>
              <span>💵</span>
              <span>📱</span>
              <span>🏦</span>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2026 Travelly - Todos os direitos reservados</p>
          <div class="footer-badges">
            <span class="badge">🌍 50+ Destinos</span>
            <span class="badge">⭐ 4.8 Avaliação</span>
            <span class="badge">🔒 Pagamento Seguro</span>
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
      font-size: 1.2rem;
      transition: all 0.3s;
      border: 1px solid rgba(255,255,255,0.1);
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
      display: inline-block;
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
    }

    .footer-links a:hover {
      color: #00D9FF;
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

    .newsletter-form button {
      background: linear-gradient(135deg, #6C3BD4, #00D9FF);
      border: none;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      cursor: pointer;
      color: white;
      font-size: 1.2rem;
      transition: transform 0.3s;
    }

    .newsletter-form button:hover {
      transform: translateX(3px);
    }

    .payment-methods {
      display: flex;
      gap: 12px;
      font-size: 1.5rem;
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
    }
  `]
})
export class FooterComponent {
  ano = new Date().getFullYear();
}