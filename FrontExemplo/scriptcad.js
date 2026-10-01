const api = "http://localhost:3000";
document.querySelector("#enviar").addEventListener("click", async () => {
  const senha = document.querySelector("#senha").value;
  const nova = document.querySelector("#Csenha").value;
  if (nova != senha || senha == "" || nova == "") {
    alert("As senhas precisam ser iguais");
  } else {
    const dados = {
      user: document.querySelector("#nome").value,
      password: senha,
    };
    const resposta = await fetch(`${api}/cadastro`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(dados),
    });
    if (resposta.status != 201) {
      return alert("Erro ao cadastrar");
    }
    window.location.href = "./login.html";
  }
});
