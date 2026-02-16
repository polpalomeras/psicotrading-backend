<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Psicotrading IA</title>
  <style>
    body {
      background: #0e0e0e;
      color: white;
      font-family: Arial;
      text-align: center;
      padding: 40px;
    }

    #chat {
      width: 400px;
      height: 400px;
      margin: 0 auto;
      background: #1c1c1c;
      padding: 20px;
      overflow-y: auto;
      border-radius: 10px;
      text-align: left;
    }

    input {
      width: 300px;
      padding: 10px;
    }

    button {
      padding: 10px;
      background: #00bcd4;
      border: none;
      cursor: pointer;
    }

    .user {
      margin: 10px 0;
      color: #00bcd4;
    }

    .bot {
      margin: 10px 0;
      color: #4caf50;
    }
  </style>
</head>
<body>

  <h1>Psicotrading IA</h1>

  <div id="chat"></div>

  <br />

  <input id="mensaje" placeholder="Escribe tu pregunta..." />
  <button onclick="enviar()">Enviar</button>

  <script>
    async function enviar() {
      const input = document.getElementById("mensaje");
      const chat = document.getElementById("chat");

      const pregunta = input.value.trim();
      if (!pregunta) return;

      chat.innerHTML += `<div class="user"><b>Tú:</b> ${pregunta}</div>`;
      input.value = "";

      try {
        const response = await fetch(
          "https://psicotrading-backend-production.up.railway.app/psicotrading/contexto",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              tipo: "publico",
              usuario: "Pol",
              pregunta: pregunta
            })
          }
        );

        const data = await response.json();

        chat.innerHTML += `<div class="bot"><b>IA:</b> ${data.respuesta_voz}</div>`;
        chat.scrollTop = chat.scrollHeight;

      } catch (error) {
        chat.innerHTML += `<div class="bot">Error conectando con el servidor</div>`;
      }
    }
  </script>

</body>
</html>
