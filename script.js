// ─── Swipe no celular para navegar entre slides ───────────────────────────────
const pages = [
  'slide1.html',
  'slide2.html',
  'slide3.html',
  'slide4.html',
  'slide5.html',
  'login.html',
  'cadastro.html'
];

const currentPage = window.location.pathname.split('/').pop();
const currentIndex = pages.indexOf(currentPage);

let startX = 0;

document.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});

document.addEventListener('touchend', e => {
  const diff = startX - e.changedTouches[0].clientX;

  if (Math.abs(diff) > 50) {
    if (diff > 0 && currentIndex < pages.length - 1) {
      window.location.href = pages[currentIndex + 1];
    } else if (diff < 0 && currentIndex > 0) {
      window.location.href = pages[currentIndex - 1];
    }
  }
});


// ─── Utilitários ──────────────────────────────────────────────────────────────

function showError(input, msg) {
  clearError(input);
  input.style.borderColor = '#ef4444';
  const el = document.createElement('span');
  el.className = 'field-error';
  el.textContent = msg;
  el.style.cssText = 'display:block;font-size:12px;color:#ef4444;margin-top:5px;font-family:"DM Sans",sans-serif;';
  input.closest('.field').appendChild(el);
}

function clearError(input) {
  input.style.borderColor = '';
  const prev = input.closest('.field').querySelector('.field-error');
  if (prev) prev.remove();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setLoading(btn, loading) {
  if (loading) {
    btn.dataset.originalText = btn.textContent;
    btn.textContent = 'Aguarde…';
    btn.disabled = true;
    btn.style.opacity = '0.7';
  } else {
    btn.textContent = btn.dataset.originalText || btn.textContent;
    btn.disabled = false;
    btn.style.opacity = '';
  }
}

// ─── Toggle mostrar/ocultar senha ─────────────────────────────────────────────

function addPasswordToggle(input) {
  const wrap = input.closest('.inp-wrap');

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Mostrar senha');
  btn.style.cssText = `
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    color: #9ca3af;
    transition: color 0.2s;
  `;

  const eyeOpen = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const eyeClosed = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

  btn.innerHTML = eyeOpen;

  btn.addEventListener('click', () => {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.innerHTML = isPassword ? eyeClosed : eyeOpen;
    btn.style.color = isPassword ? '#6366f1' : '#9ca3af';
  });

  // Ajusta padding do input para não sobrepor o ícone
  input.style.paddingRight = '40px';
  wrap.appendChild(btn);
}

// Aplica toggle em todos os campos de senha da página
document.querySelectorAll('input[type="password"]').forEach(addPasswordToggle);


// ─── Login ────────────────────────────────────────────────────────────────────

const loginBtn = document.querySelector('.auth-card .btn-primary.full');

if (currentPage === 'login.html' && loginBtn) {
  const [emailInput, senhaInput] = document.querySelectorAll('.auth-card input');

  // Limpa erro ao digitar
  emailInput.addEventListener('input', () => clearError(emailInput));
  senhaInput.addEventListener('input', () => clearError(senhaInput));

  loginBtn.addEventListener('click', async () => {
    let valid = true;

    if (!emailInput.value.trim()) {
      showError(emailInput, 'Informe seu e-mail.');
      valid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showError(emailInput, 'E-mail inválido.');
      valid = false;
    }

    if (!senhaInput.value) {
      showError(senhaInput, 'Informe sua senha.');
      valid = false;
    } else if (senhaInput.value.length < 6) {
      showError(senhaInput, 'Mínimo 6 caracteres.');
      valid = false;
    }

    if (!valid) return;

    setLoading(loginBtn, true);

    // Simula chamada à API (substitua pelo fetch real)
    await new Promise(r => setTimeout(r, 1500));

    setLoading(loginBtn, false);

    // Sucesso → redireciona para o app (ajuste o destino conforme necessário)
    alert('Login realizado com sucesso! ✓');
    // window.location.href = 'home.html';
  });
}


// ─── Cadastro ─────────────────────────────────────────────────────────────────

const cadastroBtn = document.querySelector('.auth-card .btn-primary.full');

if (currentPage === 'cadastro.html' && cadastroBtn) {
  const [nomeInput, emailInput, senhaInput] = document.querySelectorAll('.auth-card input');

  // Adiciona campo de confirmar senha dinamicamente
  const senhaField = senhaInput.closest('.field');
  const confirmField = document.createElement('div');
  confirmField.className = 'field';
  confirmField.innerHTML = `
    <label>Confirmar senha</label>
    <div class="inp-wrap">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <rect x="3" y="11" width="18" height="11" rx="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
      <input type="password" placeholder="Repita a senha">
    </div>
  `;
  senhaField.after(confirmField);

  const confirmInput = confirmField.querySelector('input');
  addPasswordToggle(confirmInput);

  // Limpa erros ao digitar
  [nomeInput, emailInput, senhaInput, confirmInput].forEach(inp => {
    inp.addEventListener('input', () => clearError(inp));
  });

  cadastroBtn.addEventListener('click', async () => {
    let valid = true;

    if (!nomeInput.value.trim()) {
      showError(nomeInput, 'Informe seu nome.');
      valid = false;
    }

    if (!emailInput.value.trim()) {
      showError(emailInput, 'Informe seu e-mail.');
      valid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showError(emailInput, 'E-mail inválido.');
      valid = false;
    }

    if (!senhaInput.value) {
      showError(senhaInput, 'Crie uma senha.');
      valid = false;
    } else if (senhaInput.value.length < 6) {
      showError(senhaInput, 'Mínimo 6 caracteres.');
      valid = false;
    }

    if (!confirmInput.value) {
      showError(confirmInput, 'Confirme sua senha.');
      valid = false;
    } else if (senhaInput.value !== confirmInput.value) {
      showError(confirmInput, 'As senhas não coincidem.');
      valid = false;
    }

    if (!valid) return;

    setLoading(cadastroBtn, true);

    // Simula chamada à API (substitua pelo fetch real)
    await new Promise(r => setTimeout(r, 1500));

    setLoading(cadastroBtn, false);

    // Sucesso → redireciona para login ou home
    alert('Conta criada com sucesso! ✓');
    // window.location.href = 'login.html';
  });
}