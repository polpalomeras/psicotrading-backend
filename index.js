<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Psicotrading IA</title>
<style>
body {
  background: #0a0a0a;
  color: white;
  font-family: Arial;
  text-align: center;
}
#chat {
  width: 400px;
  height: 400px;
  margin: 40px auto;
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
  padding: 10px 20px;
  background: #00bcd4;
  border: none;
  cursor: pointer;
}
</style>
</head>
<body>

<h1>Psicotrading IA</h1>

<div id="chat"></div>

<input id="mensaje" placeholder="Escribe tu mensaje...">
<button onclick="enviar()">Enviar</button>

<script>
async function enviar() {
  const mensajeInput = document.getElementById("mensaje");
  const mensaje = mensajeInput.value;
  const chat = document.getElementById("chat");

  if (!mensaje) return;

  chat.innerHTML += "<p><strong>Tú:</strong> " + mensaje + "</p>";
  mensajeInput.value = "";

  try {
    const response = await fetch("https://TU-URL-DE-RAILWAY/psicotrading/contexto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pregunta: mensaje
      })
    });

    const data = await response.json();

    chat.innerHTML += "<p><strong>Psicólogo:</strong> " + data.respuesta + "</p>";

    chat.scrollTop = chat.scrollHeight;

  } catch (error) {
    chat.innerHTML += "<p><strong>Error:</strong> No conecta con el backend</p>";
  }
}
</script>

</body>
</html>
