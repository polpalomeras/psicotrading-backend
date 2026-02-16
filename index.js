<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Psicotrading IA</title>

  <style>
    body {
      background-color: #0e0e0e;
      color: white;
      font-family: Arial, sans-serif;
      text-align: center;
      margin: 0;
      padding: 40px;
    }

    h1 {
      margin-bottom: 30px;
    }

    #chat {
      width: 400px;
      height: 400px;
      margin: 0 auto 20px auto;
      background: #1c1c1c;
      border-radius: 10px;
      padding: 20px;
      overflow-y: auto;
      text-align: left;
    }

    #input {
      width: 300px;
      padding: 10px;
      border-radius: 5px;
      border: none;
    }

    button {
      padding: 10px 20px;
      background-color: #00bcd4;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
    }

    button:hover {
      background-color: #0097a7;
    }

    .usuario {
      color: #4fc3f7;
    }

    .ia {
      color: #81c784;
    }
  </style>
</head>

<body>

  <h1>Psicotrading IA</h1>

  <div id="chat"></div>

  <input id="input" type="text" placeholder="Escribe tu pregunta..." />
  <button onclick="enviarPregunta()">Enviar</button>

  <script>
    async function enviarPregunta() {
      const input = document.getElementById("input");
      const chat = document.getElementById("chat");

      const pregunta = input.value.trim();

      if (!pregunta) return;

      // Mostrar mensaje usuario
      chat.innerHTML += `<p class="usuario"><strong>Tú:</strong> ${pregunta}</p>`;
      chat.scrollTop = chat.scrollHeight;

      try {
        const respuesta = await fetch(
          "https://psicotrading-backend-production.up.railway.app/psicotrading/contexto",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              tipo: "publico",
              pregunta: pregunta
            })
          }
        );

        const data = await respuesta.json();

        chat.innerHTML += `<p class="ia"><strong>Psicotrading IA:</strong> ${data.respuesta_voz}</p>`;
        chat.scrollTop = chat.scrollHeight;

      } catch (error) {
        chat.innerHTML += `<p style="color:red;">Error conectando con el servidor</p>`;
      }

      input.value = "";
    }

    // Permitir enviar con Enter
    document.getElementById("input").addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        enviarPregunta();
      }
    });
  </script>

</body>
</html>
