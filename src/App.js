import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

// Анимации
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Стилизованные компоненты
const AppContainer = styled.div`
  font-family: 'Arial', sans-serif;
  background-color: #f5f7fa;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const PageIndicator = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 100;
`;

const IndicatorDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.$active ? '#4285f4' : '#ccc'};
  transition: background-color 0.3s ease;
`;

const QueueContainer = styled.div`
  flex: 1;
  display: grid;
  grid-template-rows: none;
  grid-auto-rows: clamp(6vh, 10vw, 12vh);
  grid-auto-flow: row;
  width: 100%;
  background: #f5f7fa;
`;

const GridRow = styled.div`
  display: contents;
`;

const GridCell = styled.div`
  display: flex;
  align-items: center;
  font-size: clamp(1.5rem, 3vw, 3rem);
  font-weight: bold;
  color: #2c3e50;
  background: white;
  box-sizing: border-box;
  padding: 0 clamp(1vw, 2vw, 2vw);
  border-bottom: 0.3vh solid #e9ecef;
  border-right: 0.15vw solid #e9ecef;
  min-width: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-align: left;

  &:last-child {
    border-right: none;
  }
`;

const HeaderCell = styled(GridCell)`
  background: #e9ecef;
  border-bottom: 0.3vh solid #d1d5db;
`;

const TicketCard = styled.div`
  min-width: clamp(120px, 18vw, 250px);
  height: 80%;
  margin-right: clamp(0.5vw, 1vw, 1vw);
  border-radius: 0.7vw;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.3s ease-out;
  background-color: ${props => props.$isCurrent ? '#4285f4' : '#f8f9fa'};
  color: ${props => props.$isCurrent ? 'white' : '#2c3e50'};
  border: 0.15vw solid ${props => props.$isCurrent ? '#4285f4' : '#e9ecef'};
  box-shadow: ${props => props.$isCurrent ? '0 0.4vw 1.2vw rgba(66, 133, 244, 0.3)' : '0 0.2vw 0.6vw rgba(0, 0, 0, 0.05)'};
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:last-child {
    margin-right: 0;
  }
`;

const TicketContent = styled.div`
  display: flex;
  align-items: center;
  padding: 0 clamp(0.5vw, 1vw, 1vw);
`;

const TicketNumber = styled.div`
  font-size: clamp(1.2rem, 2.5vw, 2.5rem);
  font-weight: bold;
  margin-right: clamp(0.5vw, 1vw, 1vw);
`;

const TicketTime = styled.div`
  font-size: clamp(1.1rem, 2vw, 2.2rem);
  opacity: ${props => props.$isCurrent ? 0.9 : 0.7};
`;

const TicketsContainer = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  padding: 0 clamp(0.5vw, 1vw, 1vw);
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

// Моковые данные (увеличим количество кабинетов для демонстрации пагинации)
const mockData = [
  {
    id: 1,
    name: '101',
    doctor: 'Иванов И.И.',
    tickets: [
      { number: 'A101', time: '10:00', isCurrent: true },
      { number: 'A102', time: '10:15', isCurrent: false },
      { number: 'A103', time: '10:30', isCurrent: false },
      { number: 'A102', time: '10:15', isCurrent: false },
      { number: 'A102', time: '10:15', isCurrent: false },
      { number: 'A103', time: '10:30', isCurrent: false },
      { number: 'A102', time: '10:15', isCurrent: false },
      { number: 'A102', time: '10:15', isCurrent: false },
      { number: 'A103', time: '10:30', isCurrent: false },
      { number: 'A102', time: '10:15', isCurrent: false },
      { number: 'A102', time: '10:15', isCurrent: false },
      { number: 'A103', time: '10:30', isCurrent: false },
    ]
  },
  {
    id: 2,
    name: '202',
    doctor: 'Петрова А.В.',
    tickets: [
      { number: 'B201', time: '10:05', isCurrent: true },
      { number: 'B202', time: '10:20', isCurrent: false }
    ]
  },
  {
    id: 3,
    name: '305',
    doctor: 'Сидоров К.Л.',
    tickets: [
      { number: 'C301', time: '10:10', isCurrent: true },
      { number: 'C302', time: '10:25', isCurrent: false }
    ]
  },
  {
    id: 4,
    name: '108',
    doctor: 'Васильева М.Г.',
    tickets: [
      { number: 'D101', time: '10:15', isCurrent: true },
      { number: 'D102', time: '10:30', isCurrent: false }
    ]
  },
  {
    id: 5,
    name: '207',
    doctor: 'Кузнецов Д.С.',
    tickets: [
      { number: 'E201', time: '10:20', isCurrent: true },
      { number: 'E202', time: '10:35', isCurrent: false }
    ]
  },
  {
    id: 6,
    name: '310',
    doctor: 'Морозова Е.П.',
    tickets: [
      { number: 'F301', time: '10:25', isCurrent: true },
      { number: 'F302', time: '10:40', isCurrent: false }
    ]
  },
  {
    id: 7,
    name: '115',
    doctor: 'Григорьев В.А.',
    tickets: [
      { number: 'G101', time: '10:30', isCurrent: true },
      { number: 'G102', time: '10:45', isCurrent: false }
    ]
  },
  {
    id: 1,
    name: '101',
    doctor: 'Иванов И.И.',
    tickets: [
      { number: 'A101', time: '10:00', isCurrent: true },
      { number: 'A102', time: '10:15', isCurrent: false },
      { number: 'A103', time: '10:30', isCurrent: false }
    ]
  },
  {
    id: 2,
    name: '202',
    doctor: 'Петрова А.В.',
    tickets: [
      { number: 'B201', time: '10:05', isCurrent: true },
      { number: 'B202', time: '10:20', isCurrent: false },
      { number: 'C302', time: '10:25', isCurrent: false },
      { number: 'C302', time: '10:25', isCurrent: false },
      { number: 'C302', time: '10:25', isCurrent: false },
      { number: 'C302', time: '10:25', isCurrent: false },
      { number: 'C302', time: '10:25', isCurrent: false },
      { number: 'C302', time: '10:25', isCurrent: false },
      { number: 'C302', time: '10:25', isCurrent: false },
      { number: 'C302', time: '10:25', isCurrent: false },
      { number: 'C302', time: '10:25', isCurrent: false },
      { number: 'C302', time: '10:25', isCurrent: false },
    ]
  },
  {
    id: 3,
    name: '305',
    doctor: 'Сидоров К.Л.',
    tickets: [
      { number: 'C301', time: '10:10', isCurrent: true },
      { number: 'C302', time: '10:25', isCurrent: false },
      { number: 'C302', time: '10:25', isCurrent: false },
      { number: 'C302', time: '10:25', isCurrent: false },
      { number: 'C302', time: '10:25', isCurrent: false },
      { number: 'C302', time: '10:25', isCurrent: false },
      { number: 'C302', time: '10:25', isCurrent: false },
      { number: 'C302', time: '10:25', isCurrent: false },
      { number: 'C302', time: '10:25', isCurrent: false },
      { number: 'C302', time: '10:25', isCurrent: false },
      { number: 'C302', time: '10:25', isCurrent: false },
    ]
  },
  {
    id: 4,
    name: '108',
    doctor: 'Васильева М.Г.',
    tickets: [
      { number: 'D101', time: '10:15', isCurrent: true },
      { number: 'D102', time: '10:30', isCurrent: false }
    ]
  },
  {
    id: 5,
    name: '207',
    doctor: 'Кузнецов Д.С.',
    tickets: [
      { number: 'E201', time: '10:20', isCurrent: true },
      { number: 'E202', time: '10:35', isCurrent: false }
    ]
  },
  {
    id: 6,
    name: '310',
    doctor: 'Морозова Е.П.',
    tickets: [
      { number: 'F301', time: '10:25', isCurrent: true },
      { number: 'F302', time: '10:40', isCurrent: false }
    ]
  },
  {
    id: 7,
    name: '115',
    doctor: 'Григорьев В.А.',
    tickets: [
      { number: 'G101', time: '10:30', isCurrent: true },
      { number: 'G102', time: '10:45', isCurrent: false }
    ]
  },
  {
    id: 5,
    name: '207',
    doctor: 'Кузнецов Д.С.',
    tickets: [
      { number: 'E201', time: '10:20', isCurrent: true },
      { number: 'E202', time: '10:35', isCurrent: false }
    ]
  },
  {
    id: 6,
    name: '310',
    doctor: 'Морозова Е.П.',
    tickets: [
      { number: 'F301', time: '10:25', isCurrent: true },
      { number: 'F302', time: '10:40', isCurrent: false }
    ]
  },
  {
    id: 7,
    name: '115',
    doctor: 'Григорьев В.А.',
    tickets: [
      { number: 'G101', time: '10:30', isCurrent: true },
      { number: 'G102', time: '10:45', isCurrent: false }
    ]
  }
];

// Рассчитываем сколько кабинетов помещается на одной странице
const OFFICES_PER_PAGE = 7;

function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(mockData.length / OFFICES_PER_PAGE);
  const pageIntervalRef = useRef(null);

  // Автоматическое переключение страниц
  useEffect(() => {
    pageIntervalRef.current = setInterval(() => {
      setCurrentPage(prev => (prev + 1) % totalPages);
    }, 8000); // 1 минута

    return () => clearInterval(pageIntervalRef.current);
  }, [totalPages]);

  // Разбиваем данные на страницы
  const paginatedData = [];
  for (let i = 0; i < mockData.length; i += OFFICES_PER_PAGE) {
    paginatedData.push(mockData.slice(i, i + OFFICES_PER_PAGE));
  }

  return (
    <AppContainer>
      {/* Скрытый контейнер для измерения ширины фамилий */}
      <div style={{ position: 'absolute', visibility: 'hidden', height: 0, overflow: 'hidden' }}>
        {mockData.map((office, idx) => (
          <div
            key={office.id + '-' + idx}
            style={{ fontSize: '3rem', fontWeight: 'bold', padding: '0 30px', fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap' }}
          >
            {office.doctor}
          </div>
        ))}
      </div>
      {/* Шапка онлайн-табло как карточки */}
      <QueueContainer
        style={{
          gridTemplateColumns: '25% 15% 60%',
          gridAutoRows: 'clamp(6vh, 10vw, 12vh)',
        }}
      >
        {/* Шапка */}
        <HeaderCell style={{ gridColumn: 1 }}>Врач</HeaderCell>
        <HeaderCell style={{ gridColumn: 2 }}>Кабинет</HeaderCell>
        <HeaderCell style={{ gridColumn: 3 }}>Талон / Время</HeaderCell>
        {/* Данные */}
        {paginatedData[currentPage].map((office, idx) => (
          <GridRow key={office.id + '-' + idx}>
            <GridCell style={{ gridColumn: 1 }}>{office.doctor}</GridCell>
            <GridCell style={{ gridColumn: 2 }}>{office.name}</GridCell>
            <GridCell style={{ gridColumn: 3, padding: 0 }}>
              <TicketsContainer>
                {office.tickets.map((ticket, tIdx) => (
                  <TicketCard key={ticket.number} $isCurrent={ticket.isCurrent}>
                    <TicketContent>
                      <TicketNumber>{ticket.number}</TicketNumber>
                      <TicketTime $isCurrent={ticket.isCurrent}>{ticket.time}</TicketTime>
                    </TicketContent>
                  </TicketCard>
                ))}
              </TicketsContainer>
            </GridCell>
          </GridRow>
        ))}
      </QueueContainer>

      <PageIndicator>
        {Array.from({ length: totalPages }).map((_, index) => (
          <IndicatorDot 
            key={index} 
            $active={currentPage === index} 
          />
        ))}
      </PageIndicator>
    </AppContainer>
  );
}

export default App;