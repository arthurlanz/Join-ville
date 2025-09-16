// Usaremos imagens do Unsplash e Pexels para um visual mais atraente.
const allEvents = [
  // Gastronomia
  {
    id: 1,
    category: 'Gastronomia',
    title: 'Festa do colono',
    location: 'Sociedade Rio da Prata - Pirabeiraba',
    date: '17 a 20 JUL',
    image:'/gastronomia/festadocolono.jpg',
  },
  {
    id: 2,
    category: 'Gastronomia',
    title: 'Festival gastronômico de Joinville',
    location: 'Joinville - SC',
    date: '06 a 24 AGO',
    image: '/gastronomia/festivalgastronomicobanner.jpg',
  },
  {
    id: 3,
    category: 'Gastronomia',
    title: 'Craft Beer',
    location: 'Cervejaria Local',
    date: '25 SET',
    image:
      '/gastronomia/craftbeer.jpg',
  },
  {
    id: 4,
    category: 'Gastronomia',
    title: 'Comida di buteco',
    location: 'Vários locais',
    date: '30 SET',
    image:
      'https://images.unsplash.com/photo-1621873491071-b7b3aa2a4f4e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
  },
  // Clássicos de Joinville
  {
    id: 5,
    category: 'Clássicos de Joinville',
    title: 'Festa das flores',
    location: 'Parque da Cidade',
    date: '10 OUT',
    image:
      'https://images.unsplash.com/photo-1599511135142-1dd20e7552f1?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
  },
  {
    id: 6,
    category: 'Clássicos de Joinville',
    title: 'Festival de dança',
    location: 'Teatro Bolshoi',
    date: '15 OUT',
    image:
      'https://images.unsplash.com/photo-1518314916381-9d93de2e7c4f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
  },
  {
    id: 7,
    category: 'Clássicos de Joinville',
    title: 'Feira do livro',
    location: 'Centreventos Cau Hansen',
    date: '20 OUT',
    image:
      '/classicosdejoinville/feiradolivro.png',
  },
  {
    id: 8,
    category: 'Clássicos de Joinville',
    title: 'Festa das cores',
    location: 'Praça Central',
    date: '25 OUT',
    image:
      '/classicosdejoinville/festadascores.png',
  },
  // Festas e Shows
  {
    id: 9,
    category: 'Festas e Shows',
    title: 'Armandinho',
    location: 'Arena Joinville',
    date: '05 NOV',
    image:
      '/festaseshows/armandinho.png',
  },
  {
    id: 10,
    category: 'Festas e Shows',
    title: 'Matue',
    location: 'SQUARE GARDEN - Joinville',
    date: '31 OUT',
    image: '/festaseshows/matuebanner.png',
  },
  {
    id: 11,
    category: 'Festas e Shows',
    title: 'Menos é Mais e Ferrugem',
    location: 'SQUARE GARDEN - Joinville',
    date: '19 SET',
    image: '/festaseshows/menosemaisbanner.png',
  },
  {
    id: 12,
    category: 'Festas e Shows',
    title: 'Victor e Leo',
    location: 'SQUARE GARDEN - Joinville',
    date: '24 OUT',
    image:
      '/festaseshows/victoreleo.jpg',
  },
  // Destaques da Semana
  {
    id: 13,
    category: 'Destaques da Semana',
    title: 'Festival pianístico',
    location: 'Conservatório',
    date: '12 NOV',
    image:
      'https://images.pexels.com/photos/811838/pexels-photo-811838.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 14,
    category: 'Destaques da Semana',
    title: 'Festival da Vigorelli',
    location: 'Vigorelli',
    date: '18 NOV',
    image:
      'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 15,
    category: 'Destaques da Semana',
    title: 'Musicarium in Concert',
    location: 'Sala de Concertos',
    date: '22 NOV',
    image:
      'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 16,
    category: 'Destaques da Semana',
    title: 'Festival Meraki',
    location: 'Parque Zoobotânico',
    date: '28 NOV',
    image:
      'https://images.pexels.com/photos/4553364/pexels-photo-4553364.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  // Esportes
  {
    id: 17,
    category: 'Esportes',
    title: 'JEC x Blumenau',
    location: 'Estádio do Sesi',
    date: '07 SET',
    image:
      '/esportes/jeceblumenau.jpg',
  },
  {
    id: 18,
    category: 'Esportes',
    title: 'JEC x Nação',
    location: 'Arena Joinville',
    date: '14 SET',
    image:
      '/esportes/jecenacao.jpg',
  },
  {
    id: 19,
    category: 'Esportes',
    title: 'JEC x Carlos Renaux',
    location: 'Arena Joinville',
    date: '28 NOV',
    image:
      '/esportes/jececarlos.jpg',
  },
  {
    id: 20,
    category: 'Esportes',
    title: 'JEC x Santo André',
    location: 'Arena Joinville',
    date: '05 DEZ',
    image: '/esportes/jecbanner.jpeg',
  },
  // Atividades ao Ar Livre
  {
    id: 21,
    category: 'Atividades ao Ar Livre',
    title: 'Parque Zoobotânico',
    location: 'Zona Sul',
    date: 'Permanente',
    image:
      'https://images.pexels.com/photos/1660603/pexels-photo-1660603.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 22,
    category: 'Atividades ao Ar Livre',
    title: 'Corrida Pela Vida',
    location: 'Parque da Cidade',
    date: '16 NOV',
    image:
      'https://images.pexels.com/photos/1571939/pexels-photo-1571939.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 23,
    category: 'Atividades ao Ar Livre',
    title: 'Parque caminho das Águas',
    location: 'Pirabeiraba',
    date: 'Permanente',
    image:
      'https://images.pexels.com/photos/34753/hiker-wanderer-mountain-stream.jpg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 24,
    category: 'Atividades ao Ar Livre',
    title: 'Corrida Halloween',
    location: 'Centro',
    date: '31 OUT',
    image:
      'https://images.pexels.com/photos/3764560/pexels-photo-3764560.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  // Cultura
  {
    id: 25,
    category: 'Cultura',
    title: 'Animameco',
    location: 'Centro de Convenções',
    date: '18 NOV',
    image:
      'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 26,
    category: 'Cultura',
    title: 'Portão Comedy Night com Irmã Selma',
    location: 'Teatro Portão',
    date: '25 NOV',
    image:
      'https://images.pexels.com/photos/7180928/pexels-photo-7180928.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 27,
    category: 'Cultura',
    title: 'VivVeneto',
    location: 'Museu da Imigração',
    date: '02 DEZ',
    image:
      'https://images.pexels.com/photos/764883/pexels-photo-764883.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 28,
    category: 'Cultura',
    title: 'Joinville Matsuri',
    location: 'Parque da Cidade',
    date: '09 DEZ',
    image:
      'https://images.pexels.com/photos/1907009/pexels-photo-1907009.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
]

export const eventService = {
  getAllEvents() {
    return allEvents
  },
  getEventById(id) {
    return allEvents.find((event) => event.id === parseInt(id))
  },
  getEventsByCategory(categoryName) {
    return allEvents.filter((event) => event.category === categoryName)
  },
  getEventCategories() {
    // Cria um Set para pegar apenas os nomes únicos de categoria, e depois converte para Array
    return [...new Set(allEvents.map((event) => event.category))]
  },
}
