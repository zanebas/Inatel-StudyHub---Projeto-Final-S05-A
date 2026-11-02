const emMin = (min) => Date.now() + min * 60000
const hhmm = (ms) => new Date(ms).toTimeString().slice(0, 5)
const ocupada = (min) => ({ status: 'Ocupada', liberaEm: emMin(min), horarioLiberacao: hhmm(emMin(min)) })
const sala = (id, extra) => ({ id, nome: `Sala ${id}`, status: 'Livre', arCondicionado: false, tv: false, lousa: false, computador: false, ...extra })

export const USUARIO = { nome: 'Samuel Zanebone', matricula: 851, pendencia: false, reserva: null }

export const RECURSOS = [
  { key: 'arCondicionado', label: 'Ar-Condicionado' },
  { key: 'lousa', label: 'Lousa' },
  { key: 'tv', label: 'TV' },
  { key: 'computador', label: 'Computador' },
]

export const criarSalas = () => [
  sala(1, { tv: true, capacidade: 2 }),
  sala(2, { tv: true, capacidade: 2, ...ocupada(8) }),
  sala(3, { computador: true, capacidade: 2, ...ocupada(15) }),
  sala(4, { descricao: 'Estudo em Grupo', arCondicionado: true, tv: true, lousa: true, capacidade: 6 }),
  sala(5, { descricao: 'Estudo em Grupo', arCondicionado: true, tv: true, computador: true, capacidade: 6 }),
  sala(6, { tv: true, lousa: true, capacidade: 6, ...ocupada(25) }),
]

export const FILTRO_INICIAL = { arCondicionado: false, lousa: false, tv: false, computador: false, inicio: '', fim: '', capacidade: null }

export const HORARIO_AULA = '19:00 – 22:30'

const disc = (cod, nome, sigla, dia, diaLabel) => ({ cod, nome, sigla, dia, diaLabel, nota: 100, freq: 100 })
export const DISCIPLINAS = [
  disc('G04 A', 'Fundamentos de Gestão de Projetos', 'FGP', 1, 'Seg'),
  disc('S01 A', 'Paradigmas da Programação', 'PP', 2, 'Ter'),
  disc('S05 A', 'Interação Homem Máquina', 'IHM', 3, 'Qua'),
  disc('M03 A', 'Cálculo Aplicado à Engenharia I', 'CAE I', 4, 'Qui'),
  disc('E08 A', 'Eletrônica Digital Aplicada a Contadores e Sequenciadores', 'EDACS', 5, 'Sex'),
  disc('F01 A', 'Física Newtoniana Clássica', 'FNC', 5, 'Sex'),
]

export const AVISOS = [
  { t: 'Parabéns, você foi aprovado na disciplina de Interação Homem Máquina, com a melhor nota da história!', d: 'Nota final 100. Excelente trabalho!', tag: 'Acadêmico', cor: 'blue', data: '31/10' },
  { t: 'Inscrições abertas: Maratona de Programação Inatel', d: 'Monte sua equipe e inscreva-se até 15/11 na Secretaria Acadêmica.', tag: 'Urgente', cor: 'red', data: '30/10' },
  { t: 'Biblioteca: horário estendido', d: 'Funcionamento até 22:30 durante o período de provas.', tag: 'Institucional', cor: 'amber', data: '28/10' },
]

export const REGRAS = [
  ['Funcionamento', '07:30 às 22:30'],
  ['Tolerância para ocupar a sala', '10 minutos'],
  ['Extensão máxima de reserva', '30 minutos'],
  ['Reservas simultâneas', '1 por aluno'],
]

export const PERFIL = [
  ['Nome', USUARIO.nome],
  ['Matrícula', String(USUARIO.matricula)],
  ['Curso', 'Engenharia de Software – 4º período'],
]

export const TEMPO_MEDIO_USO = '1h 30min'

export const HORARIOS_BIBLIOTECA = [
  ['Segunda a Sexta', '07:30 às 22:30'],
  ['Sábado', '08:00 às 12:00'],
  ['Domingo e feriados', 'Fechada'],
  ['Tolerância para ocupar a sala', '10 minutos'],
]
