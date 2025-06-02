window.onload = () => {
  // LOGIN
  document.getElementById('btnLogin').addEventListener('click', async (e) => {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        const role = data.user.role;

        sessionStorage.setItem('token', token);
        sessionStorage.setItem('role', role);
        sessionStorage.setItem('username', data.user.username);
        sessionStorage.setItem('userId', data.user._id);
        redirecionarPorRole(role);
      } else {
        alert(data.message || 'Erro no login.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro ao comunicar com o servidor.');
    }
  });

  // REGISTO
  document.getElementById('btnRegisto').addEventListener('click', async (e) => {
    e.preventDefault();

    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const role = document.getElementById('registerRole').value;

    if (!role) {
      alert('Por favor, selecione o tipo de utilizador.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login automático
        const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok) {
          sessionStorage.setItem('token', loginData.token);
          sessionStorage.setItem('role', loginData.user.role);
          sessionStorage.setItem('username', loginData.user.username);

          redirecionarPorRole(loginData.user.role);
        } else {
          alert('Erro no login automático.');
        }
      } else {
        alert(data.message || 'Erro no registo');
      }
    } catch (error) {
      console.error(error);
      alert('Erro na comunicação com o servidor.');
    }
  });

  // Redirecionamento por role
  function redirecionarPorRole(role) {
    if (role === 'cliente') {
      window.location.href = 'cliente.html';
    } else if (role === 'tecnico') {
      window.location.href = 'tecnico.html';
    } else if (role === 'gestorOperacoes') {
      window.location.href = 'gestorOperacoes.html';
    } else {
      alert('Tipo de utilizador desconhecido.');
    }
  }
};