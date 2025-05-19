const DATA = {
    arquitetura: [
      { key:'edificacoes', img:'🏢', title:'Projeto de Edificação', desc:'Construções modernas e personalizadas.' },
      { key:'interiores', img:'🛋️', title:'Design de Interiores', desc:'Ambientes planejados.' },
      { key:'paisagismo', img:'🌳', title:'Paisagismo', desc:'Áreas verdes e jardins funcionais.' }
    ],
    estrutural: [
      { key:'concreto', img:'🏗️', title:'Estrutura de Concreto', desc:'Projetos em concreto armado e protendido.' },
      { key:'metalica', img:'🏭', title:'Estrutura Metálica', desc:'Soluções leves em aço.' },
      { key:'madeira', img:'🌲', title:'Estrutura em Madeira', desc:'Projetos inovadores em madeira.' }
    ],
    instalacoes: [
      { key:'hidrossanitarias', img:'🚿', title:'Hidrossanitárias', desc:'Sistemas de água e esgoto.' },
      { key:'eletricas', img:'💡', title:'Elétricas', desc:'Instalações elétricas seguras.' },
      { key:'infra', img:'🛠️', title:'Infraestrutura/Drenagem', desc:'Projetos de infraestrutura.' },
      { key:'spda', img:'🌩️', title:'SPDA', desc:'Proteção contra descargas atmosféricas.' },
      { key:'dados', img:'🔗', title:'Rede de Dados/CFTV', desc:'Projetos de dados e monitoramento.' },
      { key:'incendio', img:'🔥', title:'Combate a Incêndio', desc:'Projetos de prevenção e combate a incêndio.' }
    ],
    mecanica: [
      { key:'hvac', img:'❄️', title:'HVAC', desc:'Climatização e ventilação.' },
      { key:'glp', img:'🛢️', title:'GLP', desc:'Sistemas de gás GLP.' },
      { key:'gases', img:'💨', title:'Gases Medicinais', desc:'Para hospitais e clínicas.' }
    ],
    laudos: [
      { key:'licencas', img:'📄', title:'Licenças Ambientais', desc:'Regularize seu empreendimento.' },
      { key:'orcamento', img:'📊', title:'Orçamentação', desc:'Planilhas e orçamentos.' },
      { key:'acessibilidade', img:'♿', title:'Acessibilidade', desc:'Projetos conforme NBR 9050.' }
    ]
  };
  
  let pedido = JSON.parse(localStorage.getItem('pedidoDYF')) || [];
  
  // Renderização dos Itens
  function renderCategoria(cat, listaId) {
    const ul = document.getElementById(listaId);
    ul.innerHTML = '';
    DATA[cat].forEach((item, idx) => {
      const linha = document.createElement('li');
      linha.className = 'card';
      linha.innerHTML = `
        <div class="img">${item.img}</div>
        <div class="title">${item.title}</div>
        <div class="desc">${item.desc}</div>
        <div class="card-controls">
          <button class="btn-solicitar" onclick="removePedido('${cat}','${item.key}')">-</button>
          <span id="count-${cat}-${item.key}" class="item-count">${contaItemPedido(cat,item.key)}</span>
          <button class="btn-solicitar" onclick="addPedido('${cat}','${item.key}')">+</button>
        </div>
      `;
      ul.appendChild(linha);
    });
  }
  renderCategoria('arquitetura','arquitetura-list');
  renderCategoria('estrutural','estrutural-list');
  renderCategoria('instalacoes','instalacoes-list');
  renderCategoria('mecanica','mecanica-list');
  renderCategoria('laudos','laudos-list');
  
  // Scroll para categoria
  function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({behavior: 'smooth'});
  }
  
  function addPedido(cat, key) {
    const idx = pedido.findIndex(i => i.cat === cat && i.key === key);
    if (idx >= 0) pedido[idx].qtd++;
    else pedido.push({cat, key, qtd:1});
    localStorage.setItem('pedidoDYF', JSON.stringify(pedido));
    atualizarPedido();
  }
  function removePedido(cat, key) {
    const idx = pedido.findIndex(i => i.cat === cat && i.key === key);
    if (idx >= 0) {
      pedido[idx].qtd--;
      if (pedido[idx].qtd <= 0) pedido.splice(idx, 1);
      localStorage.setItem('pedidoDYF', JSON.stringify(pedido));
      atualizarPedido();
    }
  }
  function contaItemPedido(cat,key) {
    const found = pedido.find(i=>i.cat===cat && i.key===key);
    return found ? found.qtd : 0;
  }
  function atualizarPedido() {
    Object.keys(DATA).forEach(cat=>{
      DATA[cat].forEach(item=>{
        const span = document.getElementById(`count-${cat}-${item.key}`);
        if(span) span.innerText = contaItemPedido(cat,item.key);
      });
    });
    let total = pedido.reduce((acc,i)=> acc + i.qtd,0);
    if (total > 0) {
      document.getElementById('pedido-fixo').style.display = 'flex';
      let resumo = pedido.map(i=>{
        let item = DATA[i.cat].find(it=>it.key===i.key);
        return `${item.title} (${i.qtd})`;
      }).join(', ');
      document.getElementById('pedido-resumo').innerText = `Pedido: ${resumo}`;
    } else {
      document.getElementById('pedido-fixo').style.display = 'none';
    }
  }
  atualizarPedido();
  
  // Modal
  function abrirModal() {
    document.getElementById('modal-bg').classList.add('active');
    document.getElementById('nome').value = '';
    document.getElementById('cidade').value = '';
  }
  function fecharModal() {
    document.getElementById('modal-bg').classList.remove('active');
  }
  document.getElementById('modal-bg').addEventListener('click', function(e){
    if(e.target===this) fecharModal();
  });
  
  // WhatsApp
  function enviarPedidoWhatsApp() {
    const nome = document.getElementById('nome').value.trim();
    const cidade = document.getElementById('cidade').value.trim();
    if (!nome || !cidade) {
      alert('Preencha seu nome e cidade!');
      return;
    }
    let msg = "Olá, acabei de fazer meu pedido pelo cardápio digital:\n";
    pedido.forEach(i=>{
      let item = DATA[i.cat].find(it=>it.key===i.key);
      msg += `- ${item.title} (Qtd: ${i.qtd})\n`;
    });
    msg += `\nNome: ${nome}\nCidade: ${cidade}`;
    const link = `https://api.whatsapp.com/send?phone=5586994496150&text=${encodeURIComponent(msg)}`;
    window.open(link, '_blank');
    fecharModal();
  }
  
  window.addEventListener('storage', atualizarPedido);
  