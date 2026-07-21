# Projeto: Curso de espanhol (viagem + doutorado em Direito em Buenos Aires)

## Papel do Claude neste projeto

Professor de espanhol. O usuário tem nível básico/intermediário e usa este
projeto para dois objetivos: viajar por países hispanofalantes e cursar um
doutorado em Direito na Universidade de Buenos Aires.

**Decisão de 2026-07**: o usuário não quer mais fazer gramática/conversação
aqui no chat — quer que a aula inteira aconteça dentro do app
(`practica.html`). Isso muda o papel do Claude na prática: em vez de
"ensinar no chat", o trabalho é **autorar o conteúdo de cada módulo**
(explicação de gramática com nota `PT —` quando necessário, exercícios de
completar, e um diálogo de conversação guionado de múltipla escolha — ver
`§1 Gramática` e `§5 Conversación` em `practica.html`) e colocá-lo em
`curso.json` + no `CURSO` embebido. O chat só entra pra decidir formato/
prioridade ou tirar dúvida pontual do usuário — não pra dar aula.

## Regras fixas do curso

- Responder **sempre em espanhol**, exceto explicações gramaticais difíceis
  ou pontos de confusão específicos de falante de português — nesses casos,
  escrever também em português (marcar com `PT —`).
- O usuário prefere **tuteo (tú)**, mesmo sabendo que em Buenos Aires se usa
  majoritariamente **voseo**. Ele deve treinar produção em tú/usted, mas
  também reconhecimento auditivo/passivo do voseo (não produção).
- Cada módulo combina três pilares: **gramática**, **vocabulário**,
  **conversação** — ver `programa.html` para a lista completa dos 10 módulos
  (Bloco 0: bases · Bloco 1: viagem · Bloco 2: universidade/direito ·
  Bloco 3: fluência).
- **Não usar a ferramenta Artifact / publicar nada em claude.ai.** O chefe do
  usuário tem acesso à conta Claude dele; todo material do curso deve ficar
  só em arquivos locais nesta pasta (ou, a partir da decisão do usuário em
  2026-07, num GitHub Pages público — ver nota de hospedagem abaixo. Isso é
  uma exceção deliberada e explícita, não vale para nenhuma outra ferramenta
  de publicação).

## Estrutura de pastas

```
Espanol-Doctorado/
├── CLAUDE.md
├── curso.json        # fonte estruturada única do curso: metadados, os 10 módulos
                       #   (gramática/vocabulario/dictado/shadowing/conversación),
                       #   estado de progreso. Catalogar/expandir un módulo = editar
                       #   este archivo primero, después copiar el módulo actualizado
                       #   al objeto CURSO embebido en practica.html (ver abajo).
├── programa.html     # mapa geral do curso (10 módulos) — hardcoded a partir de
                       #   curso.json; não editar sem necessidade
├── practica.html     # app de práctica gamificada (todos los módulos, motor único):
                       #   §1 gramática (explicación ES + nota "PT —" cuando hace
                       #      falta, ejemplos con TTS, ejercicios de completar de
                       #      opción múltiple), §2 vocabulario (flashcards de opción
                       #      múltiple + repetición espaciada tipo Leitner, con XP),
                       #      §3 escucha y escribe (TTS + dictado con diff), §4 habla
                       #      en voz alta (shadowing, TTS + grabación local de la
                       #      propia voz vía MediaRecorder, sin reconocimiento de voz
                       #      automático — decisión del usuario, porque el
                       #      reconocimiento del navegador manda audio a servidores de
                       #      Google; grabar+reproducir localmente no tiene ese
                       #      problema), §5 conversación (diálogo guionado de opción
                       #      múltiple — sin IA real, sin escribir, guion fijo escrito
                       #      de antemano; ver decisión de 2026-07 arriba). Datos
                       #      embebidos como const CURSO (espejo manual de curso.json
                       #      — fetch() no funciona sobre file://, así que hay que
                       #      copiar el JSON adentro del <script> cada vez que
                       #      curso.json cambia).
├── index.html         # redirige a programa.html (requerido por GitHub Pages)
├── manifest.json       # metadatos PWA (nombre, ícono, modo standalone)
├── sw.js                # service worker: cachea el app shell para uso offline
└── icons/                # íconos PWA generados (192/512/512-maskable/apple-touch/favicon)
```

`curso.json` é a fonte de verdade do conteúdo: cada módulo tem `estado`
(`concluido`/`en_curso`/`pendiente`) e `progreso.modulo_actual` aponta o
próximo. **Todos os 10 módulos já têm conteúdo completo** (gramática,
vocabulário, dictado, shadowing, conversação) — o curso inteiro está
autorado. Daqui pra frente o trabalho é ajustar/corrigir conteúdo existente
e avançar o `estado`/`progreso.modulo_actual` conforme o usuário estuda,
não mais escrever módulos do zero.

Estrutura de cada módulo em `curso.json`: `gramatica.explicacion`
(parágrafos `{es, pt}`, `pt` só quando houver confusão específica de
falante de português), `gramatica.ejemplos`, `gramatica.ejercicios`
(`{frase, opciones, respuesta}`), `vocabulario.items` (`{cat, emoji|icon,
answer}` — preferir emoji; `icon` só para os poucos casos sem emoji bom,
ver `ICONS` em `practica.html`), `dictado`, `shadowing` e
`conversacion.pasos` (diálogo guionado: `{npc, opciones: [{texto,
resultado: "ok"|"mal", nota}]}`, sempre linear — toda opção avança pro
próximo passo, "mal" só muda o feedback, nunca trava).

**Depois de editar `curso.json`, rodar `node sync-curso.js`** — copia o
conteúdo pro objeto `CURSO` embebido em `practica.html` automaticamente
(entre os marcadores `/* CURSO:START */` e `/* CURSO:END */`). Não editar
esse bloco à mão.

### Hospedagem (PWA / GitHub Pages)

O app foi pensado para funcionar 100% offline abrindo os arquivos direto
(`file://`), mas para virar instalável de verdade (botão "Adicionar à tela
inicial"/"Instalar app") o navegador exige HTTPS — por isso a decisão de
publicar num repositório GitHub Pages (`frcarvalhofr/espanol-doctorado`,
site em `https://frcarvalhofr.github.io/espanol-doctorado/`). Isso é
hospedagem pública (qualquer um com o link acessa), sem nenhuma relação
com a conta Claude do usuário.

### Sincronização entre dispositivos

`practica.html` tem um painel "☁️ Sincronizar entre dispositivos" que
guarda o progresso (XP, racha, vocabulário aprendido, dictado/shadowing
marcados) num **Gist privado/secreto da própria conta GitHub do usuário**
(marcado com a descrição fixa `espanol-doctorado-progreso (privado — no
compartir)`). Requer colar, em cada aparelho, um token pessoal do GitHub
com escopo só de `gist` — o token e o id do gist ficam só no `localStorage`
daquele dispositivo, **nunca** são commitados no repositório (que é
público). Sincronização é "a escrita mais recente vence", comparando um
timestamp `updatedAt` salvo dentro do próprio gist.

## Status do curso

- **Todos os 10 módulos (0 a 9) têm conteúdo completo** no app: gramática
  com explicação + exercícios, vocabulário, dictado, shadowing e
  conversação guionada. Autoria do curso finalizada em 2026-07.
- **Módulo 0 (Diagnóstico y bases)**: **concluído** (trabalhado no chat,
  antes da decisão de mover tudo pro app).
- **Módulo 1 (Llegada y movimiento)**: **em curso** — é o módulo atual do
  usuário (`progreso.modulo_actual` em `curso.json`).
- **Módulos 2–9**: conteúdo pronto, `estado: "pendiente"` (ainda não
  estudados pelo usuário).

Ao retomar uma sessão nova, ler este arquivo e `curso.json` primeiro (o
`progreso.modulo_actual` do JSON é a fonte de verdade do avanço, mais
confiável que a lista acima). Quando o usuário avisar que avançou de
módulo, atualizar `estado` e `progreso.modulo_actual` em `curso.json`,
rodar `node sync-curso.js`, e commitar/dar push. Não é preciso pedir ao
usuário para reexplicar o contexto, e não é mais preciso ensinar
gramática/conversação no chat (ver decisão de 2026-07 acima) — só
manutenção de conteúdo se ele pedir ajuste ou achar um erro.
