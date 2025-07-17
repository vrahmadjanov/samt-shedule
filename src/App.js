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
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const PageContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  opacity: ${props => props.$active ? 1 : 0};
  transition: opacity 0.5s ease;
`;

const OfficeRow = styled.div`
  display: flex;
  height: 10%;
  min-height: 120px;
  margin-bottom: 2px;
  background: white;
  overflow: hidden;
`;

const OfficeCard = styled.div`
  min-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  color: #2c3e50;
  background: white;
  border-right: 1px solid #e9ecef;
  padding: 0 30px;
`;

const TicketsWrapper = styled.div`
  position: relative;
  flex: 1;
  overflow: hidden;
`;

const TicketsContainer = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  padding: 0 20px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const FadeEffect = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100%;
  background: linear-gradient(90deg, rgba(245,247,250,0) 0%, rgba(245,247,250,1) 100%);
  pointer-events: none;
`;

const TicketCard = styled.div`
  min-width: 250px;
  height: 80%;
  margin-right: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.3s ease-out;
  background-color: ${props => props.$isCurrent ? '#4285f4' : '#f8f9fa'};
  color: ${props => props.$isCurrent ? 'white' : '#2c3e50'};
  border: 2px solid ${props => props.$isCurrent ? '#4285f4' : '#e9ecef'};
  box-shadow: ${props => props.$isCurrent ? '0 4px 12px rgba(66, 133, 244, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.05)'};
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:last-child {
    margin-right: 0;
  }
`;

const TicketContent = styled.div`
  display: flex;
  align-items: center;
  padding: 0 20px;
`;

const TicketNumber = styled.div`
  font-size: 3rem;
  font-weight: bold;
  margin-right: 20px;
`;

const TicketTime = styled.div`
  font-size: 2.5rem;
  opacity: ${props => props.$isCurrent ? 0.9 : 0.7};
`;

// Моковые данные (увеличим количество кабинетов для демонстрации пагинации)
const mockData = [
  {
    id: 1,
    name: 'Кабинет 101',
    tickets: [
      { number: 'A101', time: '10:00', isCurrent: true },
      { number: 'A102', time: '10:15', isCurrent: false },
      { number: 'A103', time: '10:30', isCurrent: false }
    ]
  },
  {
    id: 2,
    name: 'Кабинет 202',
    tickets: [
      { number: 'B201', time: '10:05', isCurrent: true },
      { number: 'B202', time: '10:20', isCurrent: false }
    ]
  },
  {
    id: 3,
    name: 'Кабинет 305',
    tickets: [
      { number: 'C301', time: '10:10', isCurrent: true },
      { number: 'C302', time: '10:25', isCurrent: false }
    ]
  },
  {
    id: 4,
    name: 'Кабинет 108',
    tickets: [
      { number: 'D101', time: '10:15', isCurrent: true },
      { number: 'D102', time: '10:30', isCurrent: false }
    ]
  },
  {
    id: 5,
    name: 'Кабинет 207',
    tickets: [
      { number: 'E201', time: '10:20', isCurrent: true },
      { number: 'E202', time: '10:35', isCurrent: false }
    ]
  },
  {
    id: 6,
    name: 'Кабинет 310',
    tickets: [
      { number: 'F301', time: '10:25', isCurrent: true },
      { number: 'F302', time: '10:40', isCurrent: false }
    ]
  },
  {
    id: 7,
    name: 'Кабинет 115',
    tickets: [
      { number: 'G101', time: '10:30', isCurrent: true },
      { number: 'G102', time: '10:45', isCurrent: false }
    ]
  },
  {
    id: 1,
    name: 'Кабинет 101',
    tickets: [
      { number: 'A101', time: '10:00', isCurrent: true },
      { number: 'A102', time: '10:15', isCurrent: false },
      { number: 'A103', time: '10:30', isCurrent: false }
    ]
  },
  {
    id: 2,
    name: 'Кабинет 202',
    tickets: [
      { number: 'B201', time: '10:05', isCurrent: true },
      { number: 'B202', time: '10:20', isCurrent: false }
    ]
  },
  {
    id: 3,
    name: 'Кабинет 305',
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
    name: 'Кабинет 108',
    tickets: [
      { number: 'D101', time: '10:15', isCurrent: true },
      { number: 'D102', time: '10:30', isCurrent: false }
    ]
  },
  {
    id: 5,
    name: 'Кабинет 207',
    tickets: [
      { number: 'E201', time: '10:20', isCurrent: true },
      { number: 'E202', time: '10:35', isCurrent: false }
    ]
  },
  {
    id: 6,
    name: 'Кабинет 310',
    tickets: [
      { number: 'F301', time: '10:25', isCurrent: true },
      { number: 'F302', time: '10:40', isCurrent: false }
    ]
  },
  {
    id: 7,
    name: 'Кабинет 115',
    tickets: [
      { number: 'G101', time: '10:30', isCurrent: true },
      { number: 'G102', time: '10:45', isCurrent: false }
    ]
  }
];

// Рассчитываем сколько кабинетов помещается на одной странице
const OFFICES_PER_PAGE = 10;

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
      <QueueContainer>
        {paginatedData.map((pageData, pageIndex) => (
          <PageContainer 
            key={pageIndex} 
            $active={currentPage === pageIndex}
          >
            {pageData.map(office => (
              <OfficeRow key={office.id}>
                <OfficeCard>
                  {office.name}
                </OfficeCard>
                <TicketsWrapper>
                  <TicketsContainer>
                    {office.tickets.map((ticket, index) => (
                      <TicketCard key={ticket.number} $isCurrent={ticket.isCurrent}>
                        <TicketContent>
                          <TicketNumber>{ticket.number}</TicketNumber>
                          <TicketTime $isCurrent={ticket.isCurrent}>{ticket.time}</TicketTime>
                        </TicketContent>
                      </TicketCard>
                    ))}
                  </TicketsContainer>
                  <FadeEffect />
                </TicketsWrapper>
              </OfficeRow>
            ))}
          </PageContainer>
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