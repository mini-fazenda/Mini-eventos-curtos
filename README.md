# Mini-eventos curtos — Vila da Colheita

Menu: https://mini-fazenda.github.io/Mini-eventos-curtos/menu.html

## Sexta-feira 13 — Sorte ou Azar?
- O menu remoto só mostra a interface. Todas as recompensas são calculadas pelo adaptador do jogo, na branch `mini-evento-sexta-feira-13`.
- Ícone do evento: GIF temporário no HUD do jogo, imediatamente abaixo do botão do Natal, no mesmo tamanho. **Não há mais gato posicionado no mapa como botão do evento.**
- A cada alimentação: 500 moedas, 1 giro liberado e espera de 60 segundos antes da próxima alimentação.
- 13 giros por ciclo e 13 horas de descanso ao atingir o limite.
- 70% de azar (sem prêmio) e 30% de sorte.
- Nas jogadas de sorte, gato raro com 5% de chance. Após 10 giros sem gato (contando azar e outros prêmios), chance de gato passa a 30% **entre as jogadas de sorte** até ser recebido, reiniciando a contagem.
- Demais prêmios nas jogadas de sorte: moedas de 500 a 1.500, XP de 50 a 250 e Mini Grana de 1 a 2. O peso de Mini Grana é multiplicado por 0,5 a cada prêmio anterior dessa categoria.
- O Gatinho Preto é um **animal permanente** no Mini Baú (`gatopreto`), ocupa um tile na fazenda, tem escala menor que o porco e vende por 5.000 moedas. Seu código e GIF pertencem ao repositório do jogo, não a este repositório.
- O GIF do dado conclui sua animação (1,3 s) antes de revelar o resultado.
- Este repositório mantém as artes do menu; o botão de HUD é armazenado em `public/assets/events/sexta13/botao-hud.gif` na branch do jogo.

## Janela e encerramento
`event.json`: ativo de 13/11/2026 00h até 16/11/2026 00h (UTC−03:00). A branch do jogo respeita essas datas. Ao terminar, o botão desaparece, o menu fecha e os prêmios recebidos permanecem no save.

## Isolamento
Para remover o evento, retire apenas o script temporário `public/events/short-events.js` e seu GIF de HUD. **Não remova** `public/animals/black-cat.js`, `public/assets/animais/gato-preto.gif` nem as integrações permanentes do animal. Consulte `docs/SEXTA13-REMOVAL.md` na branch do jogo.

## Segurança
A concessão está integrada à lógica do host no navegador e ao save online atual; **não** é um sistema antifraude validado no backend. Antes de liberar prêmios premium para todos, é necessário validar giros e emissões com recibos autenticados e idempotentes no servidor.
