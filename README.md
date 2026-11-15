# Inatel-StudyHub---Projeto-Final-S05-A

Módulo integrado ao App Acadêmico do Inatel para consulta em tempo real e reserva autônoma de salas de estudo da biblioteca.


## Funcionalidades Principais

* **Ecossistema Acadêmico Integrado:** Navegação completa pelas abas base do App Inatel (*Avisos*, *Horários*, *Notas*, *StudyHub* e *Menu*).
* **Lotação em Tempo Real:** Painel superior com contagem de salas livres, barra de ocupação institucional, previsão de próxima liberação, filtro rápido (*"Apenas livres"*) e indicadores de status (`Livre` / `Ocupada`).
* **Filtros Multicritério & Sugestão Inteligente:** Filtragem por equipamentos (*TV*, *Lousa*, *Computador*, *Ar-Condicionado*), capacidade de alunos, faixa de horário e atalho automático baseado na próxima janela livre da grade horária do estudante.
* **Fila de Espera para Salas Ocupadas:** Ativação de aviso com notificação (*toast*) assim que uma sala ocupada for liberada.
* **Agendamento com Participantes:** Preenchimento automático dos dados do titular, adição dinâmica de matrículas de colegas (com validação de capacidade máxima da sala) e bloqueio preventivo contra reservas simultâneas.
* **Check-in Presencial via QR Code (Tolerância de 10 Minutos):** Validação presencial obrigatória com cronômetro regressivo de `10:00` minutos para evitar reservas abandonadas (*no-show*), liberando em seguida as opções de extensão de tempo (`+30 min`) ou devolução imediata.


# Tecnologias Utilizadas

React.js

Vite 

Tailwind css

# Como Executar o Projeto

1. Clone o repositório:  
`git clone https://github.com/zanebas/Inatel-StudyHub---Projeto-Final-S05-A`

2. Acesse a pasta do projeto:  
`cd Inatel-StudyHub---Projeto-Final-S05-A`

3. Instale as dependências:  
`npm install`

4. Inicie o servidor de desenvolvimento:  
`npm run dev`

# Para visualizar
`https://zanebas.github.io/Inatel-StudyHub---Projeto-Final-S05-A/`
