export const generateId = (): string =>
  Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

export const calcularIdade = (dataNascimento: string): string => {
  const hoje = new Date();
  const nasc = new Date(dataNascimento);
  const diffMs = hoje.getTime() - nasc.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 30) return `${diffDays} dia${diffDays !== 1 ? 's' : ''}`;
  if (diffDays < 365) {
    const meses = Math.floor(diffDays / 30);
    return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
  }
  const anos = Math.floor(diffDays / 365);
  const mesesRestantes = Math.floor((diffDays % 365) / 30);
  return mesesRestantes > 0
    ? `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${mesesRestantes} ${mesesRestantes === 1 ? 'mês' : 'meses'}`
    : `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
};

export const formatarEspecie = (especie: 'cao' | 'gato'): string =>
  especie === 'cao' ? 'Cão' : 'Gato';

export const especieEmoji = (especie: 'cao' | 'gato'): string =>
  especie === 'cao' ? '🐕' : '🐈';

export const formatarSexo = (sexo: 'M' | 'F' | 'outro'): string => {
  if (sexo === 'M') return 'Masculino';
  if (sexo === 'F') return 'Feminino';
  return 'Outro';
};

export const labelStatus = (status: 'pendente' | 'aceita' | 'recusada'): string => {
  if (status === 'pendente') return 'Pendente';
  if (status === 'aceita') return 'Aceita';
  return 'Recusada';
};
