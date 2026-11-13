# Mini-eventos curtos — Vila da Colheita

Pacote externo para eventos de 1 a 3 dias. Independente do jogo principal.

## Sexta-feira 13
- `event.json`: ativa/desativa, datas, preço, limites, probabilidades e pesos das categorias de recompensa.
- `menu.html`, `menu.css`, `menu.js`: interface isolada recebendo snapshot do host via postMessage.
- `assets/sexta13/`: coloque **gato.gif**, **banner.png**, **fundo.png**. Sem arte enviada, há placeholders no menu.
- O gato aparece no mapa somente via adaptador do jogo; não existe concessão de moedas/XP no iframe.
- A cada alimentação válida desconta 500 moedas, disponibiliza 1 giro, inicia 60 s até poder alimentar novamente. O 13º giro bloqueia por 13 h; ciclo reinicia após o bloqueio.
- Sorte: 35%. Azar: 65%. Sorte escolhe uma das quatro categorias com pesos de `event.json`.
- Mini Granas e prêmios raros exigem concessão validada pelo host, não comandos aceitos diretamente do menu.

## Publicação
Ativar GitHub Pages com GitHub Actions. `event.json` desativado por padrão até a integração ser testada. Ao terminar, altere `active` para false; o save e os ativos permanentes permanecem no jogo.

**Atenção**: arquitetura modular de protótipo. A validação econômica final deve ser feita no backend autenticado, não apenas no JavaScript do navegador.
