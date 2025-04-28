function calcular() {
    const valor = parseFloat(document.getElementById('valor').value);
    const juros = parseFloat(document.getElementById('juros').value) / 100;
    const parcelas = parseInt(document.getElementById('parcelas').value);
    const tipo = document.getElementById('tipo').value;
    const resultado = document.getElementById('resultado');

    if (!valor || !juros || !parcelas) {
      resultado.innerHTML = "<p>Preencha todos os campos corretamente.</p>";
      return;
    }

    let html = "<table><tr><th>Parcela</th><th>Amortização</th><th>Juros</th><th>Prestação</th><th>Saldo Devedor</th></tr>";
    let saldo = valor;

    if (tipo === "SAC") {
      const amortizacao = valor / parcelas;
      for (let i = 1; i <= parcelas; i++) {
        const jurosParcela = saldo * juros;
        const prestacao = amortizacao + jurosParcela;
        saldo -= amortizacao;
        html += `<tr>
          <td>${i}</td>
          <td>R$ ${amortizacao.toFixed(2)}</td>
          <td>R$ ${jurosParcela.toFixed(2)}</td>
          <td>R$ ${prestacao.toFixed(2)}</td>
          <td>R$ ${saldo.toFixed(2)}</td>
        </tr>`;
      }
    } else if (tipo === "PRICE") {
      const parcelaFixa = valor * ((juros * Math.pow(1 + juros, parcelas)) / (Math.pow(1 + juros, parcelas) - 1));
      for (let i = 1; i <= parcelas; i++) {
        const jurosParcela = saldo * juros;
        const amortizacao = parcelaFixa - jurosParcela;
        saldo -= amortizacao;
        html += `<tr>
          <td>${i}</td>
          <td>R$ ${amortizacao.toFixed(2)}</td>
          <td>R$ ${jurosParcela.toFixed(2)}</td>
          <td>R$ ${parcelaFixa.toFixed(2)}</td>
          <td>R$ ${saldo.toFixed(2)}</td>
        </tr>`;
      }
    }

    html += "</table>";
    resultado.innerHTML = html;
  }