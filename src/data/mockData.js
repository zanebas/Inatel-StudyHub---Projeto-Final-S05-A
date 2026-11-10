const emMin = (min) => Date.now() + min * 60000
const hhmm = (ms) => new Date(ms).toTimeString().slice(0, 5)

export const liberarSala = (sala) =>
  criarSalaEstudo({
    ...sala,
    status: true,
    horarioEntrada: '',
    horarioSaida: '',
    liberaEm: undefined,
  })

export const marcarReservado = (sala, horarioEntrada = '', horarioSaida = '', liberaEm) =>
  criarSalaEstudo({
    ...sala,
    status: false,
    horarioEntrada,
    horarioSaida,
    liberaEm,
  })

const criarSalaEstudo = (dados) => ({
  ...dados,
  liberarSala() {
    return liberarSala(this)
  },
  marcarReservado(horarioEntrada, horarioSaida, liberaEm) {
    return marcarReservado(this, horarioEntrada, horarioSaida, liberaEm)
  },
})

const ocupada = (min) => ({
  status: false,
  horarioEntrada: hhmm(Date.now() - 30 * 60000),
  horarioSaida: hhmm(emMin(min)),
  liberaEm: emMin(min),
})

const sala = (numero, extra) =>
  criarSalaEstudo({
    numero,
    id: numero,
    nome: `Sala ${numero}`,
    status: true,
    arCondicionado: false,
    tv: false,
    lousa: false,
    computador: false,
    horarioEntrada: '',
    horarioSaida: '',
    ...extra,
  })

export const USUARIO = {
  nome: 'Samuel Zanebone',
  matricula: 851,
  pendencia: false,
  reserva: false,
}

export const RECURSOS = [
  { key: 'arCondicionado', label: 'Ar-Condicionado' },
  { key: 'lousa', label: 'Lousa' },
  { key: 'tv', label: 'TV' },
  { key: 'computador', label: 'Computador' },
]

export const criarSalas = () => [
  sala(1, { tv: true, capacidade: 2 }),
  sala(2, { computador: true, capacidade: 2, ...ocupada(8) }),
  sala(3, { descricao: 'Estudo em Grupo', tv: true, arCondicionado: true, computador: true, capacidade: 6 }),
  sala(4, { descricao: 'Estudo em Grupo', arCondicionado: true, tv: true, lousa: true, capacidade: 6, ...ocupada(15) }),
  sala(5, { lousa: true, tv: true, capacidade: 2 }),
  sala(6, { descricao: 'Estudo em Grupo', tv: true, lousa: true, capacidade: 6, ...ocupada(25) }),
]

export const FILTRO_INICIAL = {
  arCondicionado: false,
  lousa: false,
  tv: false,
  computador: false,
  horarioEntrada: '',
  horarioSaida: '',
  capacidade: null,
}

export const DISCIPLINAS = [
  { cod: 'E08 A', nome: 'Eletrônica Digital Aplicada a Contadores e Sequenciadores' },
  { cod: 'F01 A', nome: 'Física Newtoniana Clássica' },
  { cod: 'G04 A', nome: 'Fundamentos de Gestão de Projetos' },
  { cod: 'M03 A', nome: 'Cálculo Aplicado à Engenharia I' },
  { cod: 'S01 A', nome: 'Paradigmas da Programação' },
  { cod: 'S05 A', nome: 'Interação Homem Máquina' },
]

export const ALUNO = { nome: USUARIO.nome, email: 'samuel.zanebone@ges.inatel.br' }

export const AVISOS = [
  {
    titulo: 'Novidade: Inatel StudyHub',
    texto: 'Conheça o Inatel StudyHub: consulte as salas de estudo da biblioteca em tempo real, filtre por recursos e reserve a sua pela aba StudyHub.',
    tag: 'NOVIDADE',
    data: '09/11',
  },
  {
    titulo: 'Parabéns!',
    texto: 'Parabéns, você atingiu a maior nota da história do Inatel na disciplina de Interação Homem Máquina.',
    tag: 'ACADÊMICO',
    data: '09/11',
  },
  {
    titulo: 'Tesouraria: débito na Biblioteca',
    texto: 'Foi identificado um débito de R$ 15,00 referente à Biblioteca. Procure a Tesouraria para regularizar.',
    tag: 'TESOURARIA',
    data: '09/11',
  },
]

export const DIAS_SIGLAS = ['S', 'T', 'Q', 'Q', 'S', 'S']

// Grade [hora, [seg, ter, qua, qui, sex, sab]]
export const GRADE_HORARIOS = [
  ['07:00', ['S05 L1', '', 'F01 L2', 'F01 A', '', '']],
  ['08:00', ['', '', '', '', '', '']],
  ['08:50', ['', '', '', '', '', '']],
  ['10:00', ['', '', 'M03 A', '', '', '']],
  ['10:50', ['', '', 'M03 A', '', '', '']],
  ['13:30', ['', '', '', 'F01 A', '', '']],
  ['14:20', ['', '', '', 'F01 A', '', '']],
  ['15:30', ['M03 A', '', '', 'G04 A', '', '']],
  ['16:20', ['M03 A', '', '', 'G04 A', '', '']],
  ['17:30', ['E08 A', '', 'S05 A', 'S01 A', 'E08 L4', '']],
  ['18:20', ['E08 A', '', 'S05 A', 'S01 A', 'E08 L4', '']],
  ['19:30', ['', '', '', '', '', '']],
  ['20:20', ['', '', '', '', '', '']],
  ['21:30', ['', '', '', '', '', '']],
  ['22:20', ['', '', '', '', '', '']],
]

// Avaliações por disciplina [avaliação, nota]
export const NOTAS_AVALIACOES = {
  'E08 A': [['NP1', '100'], ['Prova 2', '100']],
  'F01 A': [['Prova 1', '100'], ['Prova 2', '100']],
  'G04 A': [['Exercício 1', '100'], ['Exercício 2', '100'], ['NP1', '100'], ['Exercício 3', '100']],
  'M03 A': [['NP1', '100'], ['Prova 2', '100']],
  'S01 A': [['NP1', '100'], ['Prova 2', '100']],
  'S05 A': [['NP1', '100'], ['Prova 2', '100']],
}

// Itens do menu: [título, descrição, ação] (ação: id de aba, 'logout' ou omitida = indisponível)
export const MENU_SECOES = [
  {
    titulo: 'INATEL STUDYHUB',
    itens: [['StudyHub (Reserva de Salas)', 'Consulte e reserve salas de estudo da biblioteca', 'studyhub']],
  },
  {
    titulo: 'APROVEITAMENTO ESCOLAR',
    itens: [
      ['Notas', 'Apresenta as Notas do Semestre', 'notas'],
      ['Frequência', 'Apresenta a Frequência do Semestre'],
      ['Material Didático', 'Apresenta o Material de Aula Publicado pelo Docente'],
      ['Plano de Ensino', 'Apresenta o Plano de Ensino das Disciplinas'],
      ['Histórico Escolar', 'Apresenta o Histórico Escolar do Aluno'],
      ['Coeficiente Acadêmico', 'Apresenta os Coeficientes de todos os Semestres.'],
    ],
  },
  {
    titulo: 'ATIVIDADES COMPLEMENTARES',
    itens: [
      ['Avaliações', 'Apresenta as Avaliações de A.C.'],
      ['Atividades Eletivas', 'Apresenta as Atividades Eletivas'],
      ['Atividades Obrigatórias', 'Apresenta as Atividades Obrigatórias'],
    ],
  },
  {
    titulo: 'CALENDÁRIOS E HORÁRIOS',
    itens: [
      ['Calendário Acadêmico', 'Apresenta o Calendário Acadêmico'],
      ['Eventos Inatel', 'Apresenta os Eventos do Inatel'],
      ['Provas', 'Apresenta o Calendário de Provas'],
      ['Reposições', 'Apresenta as Reposições de Aula'],
      ['Horários de Aula', 'Apresenta os Horários de Aula', 'horarios'],
      ['Cronograma de Aula', 'Apresenta o Cronograma de Aula'],
      ['Horários Atendimento Monitores', 'Apresenta os Horários de Atendimento dos Monitores'],
    ],
  },
  {
    titulo: 'TESOURARIA',
    itens: [['Consulta Lançamentos Tesouraria', 'Apresenta os Lançamentos da Tesouraria']],
  },
  {
    titulo: 'OUTRAS OPÇÕES',
    itens: [
      ['Consulta de Pedidos', 'Apresenta os Pedidos realizados'],
      ['Avaliação de Docentes', 'Avalie os Docentes das Disciplinas'],
      ['Pesquisa Institucional', 'Responda às Pesquisas Institucionais'],
      ['Central de Cópias', 'Acesse os serviços da Central de Cópias'],
      ['Requerimentos', 'Apresenta os Requerimentos do Aluno'],
      ['Configurações', 'Ajuste as configurações do aplicativo'],
      ['Sair', 'Encerra a sessão do aluno', 'logout'],
    ],
  },
]
