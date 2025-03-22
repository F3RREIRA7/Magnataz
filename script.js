document.addEventListener('DOMContentLoaded', () => {
    const currentMonthElement = document.getElementById('currentMonth');
    const calendarGrid = document.getElementById('calendarGrid');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
    const eventDateInput = document.getElementById('eventDate');
    const eventEndDateInput = document.getElementById('eventEndDate');
    const eventTitleInput = document.getElementById('eventTitle');
    const addEventButton = document.getElementById('addEvent');
    const eventList = document.getElementById('eventList');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const upcomingEventsList = document.getElementById('upcomingEventsList');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const eventEmailInput = document.getElementById('eventEmail');

    let currentDate = new Date();
    let selectedDate = null;
    let events = [];

    function isDarkModeEnabled() {
        return localStorage.getItem('darkMode') === 'enabled';
    }

    function enableDarkMode() {
        body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    }

    function disableDarkMode() {
        body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }

    function getDaysOfWeek(event) {
        if (event.daysOfWeek && Array.isArray(event.daysOfWeek) && event.daysOfWeek.length > 0) {
            return event.daysOfWeek.map(dayIndex => {
                const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
                return days[dayIndex];
            }).join(', ');
        }
        return '';
    }

    darkModeToggle.addEventListener('click', () => {
        if (isDarkModeEnabled()) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
        updateDarkModeToggleIcon();
    });

    function updateDarkModeToggleIcon() {
        if (isDarkModeEnabled()) {
            darkModeToggle.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M17.75,4.09L15.27,6.57L13.46,4.76L15.94,2.28L17.75,4.09M21.25,6.09L19.75,7.59L20.91,8.75L22.41,7.25L21.25,6.09M6.34,20.56L4.53,18.75L3.91,19.37L2.28,17.74L4.09,15.93L6.57,18.41L4.76,20.21L6.34,20.56M7.59,19.75L6.09,21.25L7.25,22.41L8.75,20.91L7.59,19.75M21.66,12.01C21.66,17.86 17.87,21.65 12.02,21.65C6.17,21.65 2.38,17.86 2.38,12.01C2.38,6.16 6.17,2.37 12.02,2.37C17.87,2.37 21.66,6.16 21.66,12.01M12.03,19.09C16.49,19.09 19.08,16.5 19.08,12.04C19.08,7.58 16.49,4.99 12.03,4.99C7.57,4.99 4.98,7.58 4.98,12.04C4.98,16.5 7.57,19.09 12.03,19.09Z" />
                </svg>`;
        } else {
            darkModeToggle.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,1L14,4H10L12,1M4,10L1,12L4,14V10M10,23L12,20L14,23H10M23,12L20,10V14L23,12M20,4L12,11L4,4H20Z" />
                </svg>`;
        }
    }

    if (isDarkModeEnabled()) {
        enableDarkMode();
    }

    updateDarkModeToggleIcon();

    function renderCalendar() {
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const startingDay = firstDayOfMonth.getDay();

        currentMonthElement.textContent = new Intl.DateTimeFormat('pt-BR', {
            month: 'long',
            year: 'numeric'
        }).format(currentDate);

        calendarGrid.innerHTML = '';

        for (let i = 0; i < startingDay; i++) {
            const emptyDiv = document.createElement('div');
            calendarGrid.appendChild(emptyDiv);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = i;
            dayDiv.dataset.day = i;

            const day = i.toString().padStart(2, '0');
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const year = currentDate.getFullYear();
            const eventDate = `${year}-${month}-${day}`;

            const eventsForDay = events.filter(event => {
                const startDate = new Date(event.date);
                const endDate = event.endDate ? new Date(event.endDate) : startDate;
                const currentDateForCheck = new Date(year, currentDate.getMonth(), i);

                const dateWithinRange = currentDateForCheck >= startDate && currentDateForCheck <= endDate;
                const dayOfWeekMatch = event.daysOfWeek ? event.daysOfWeek.includes(currentDateForCheck.getDay()) : true;

                return dateWithinRange && dayOfWeekMatch;
            });

            if (
                currentDate.getFullYear() === new Date().getFullYear() &&
                currentDate.getMonth() === new Date().getMonth() &&
                i === new Date().getDate()
            ) {
                dayDiv.classList.add('today');
            }

            if (selectedDate &&
                currentDate.getFullYear() === selectedDate.getFullYear() &&
                currentDate.getMonth() === selectedDate.getMonth() &&
                i === selectedDate.getDate()) {
                dayDiv.classList.add('selected');
            }

            eventsForDay.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                let eventText = event.title;
                dayDiv.appendChild(document.createTextNode("\n" + eventText));

                dayDiv.appendChild(eventDiv);
            });

            dayDiv.addEventListener('click', () => {
                const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);

                if (selectedDate) {
                    const previousSelectedDay = document.querySelector(`.calendar-grid div[data-day="${selectedDate.getDate()}"]`);
                    if (previousSelectedDay) {
                        previousSelectedDay.classList.remove('selected');
                    }
                }

                selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
                dayDiv.classList.add('selected');
                eventDateInput.value = `${year}-${month}-${day}`;

                eventsForDay.forEach(event => {
                    const daysOfWeek = getDaysOfWeek(event);
                    if (daysOfWeek) {
                        alert(`Este evento se repete em: ${daysOfWeek}`);
                    } else {
                        // Se não houver repetição semanal, exiba uma mensagem padrão ou não exiba nada.
                        // alert("Este evento não se repete semanalmente.");
                    }
                });
            });
            calendarGrid.appendChild(dayDiv);
        }
    }

    function addEventToList(event) {
        const eventIndex = events.findIndex(e => e.date === event.date && e.title === event.title && e.endDate === event.endDate);

        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>${event.title}</strong> - ${formatDate(event.date)} ${event.endDate ? ' - ' + formatDate(event.endDate) : ''}
            <button class="cancel-event">Cancelar</button>
        `;
        // Add color based on event title
        listItem.classList.add(`event-item-${titleToColorClass(event.title)}`);

        const cancelButton = listItem.querySelector('.cancel-event');
        cancelButton.addEventListener('click', () => {
            events.splice(eventIndex, 1);
            displayEvents();
            renderCalendar();
            displayUpcomingEvents();
        });

        eventList.appendChild(listItem);
    }
    
    function titleToColorClass(title) {
        // Simple hash function to generate a color class based on the title
        let hash = 0;
        for (let i = 0; i < title.length; i++) {
            hash = title.charCodeAt(i) + ((hash << 5) - hash);
        }

        // Ensure the hash is positive
        hash = Math.abs(hash);

        // Convert the hash to a color class index (0-4)
        const colorIndex = hash % 5;

        return `color-${colorIndex + 1}`;
    }

    function isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }
    function formatDate(dateString) {
        return dateString.split('-').reverse().join('/');
    }
    function displayEvents() {
        eventList.innerHTML = '';
        events.sort((a, b) => new Date(a.date) - new Date(b.date));
        events.forEach(event => {
            addEventToList(event);
        });
    }
    function displayUpcomingEvents() {
        upcomingEventsList.innerHTML = '';
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const startOfNextWeek = new Date(today);
        startOfNextWeek.setDate(today.getDate() + (7 - today.getDay()));
        const endOfNextWeek = new Date(today);
        endOfNextWeek.setDate(today.getDate() + (13 - today.getDay()));

        const upcoming = events.filter(event => {
            const endDate = event.endDate ? new Date(event.endDate) : new Date(event.date);
            return endDate >= today;
        });

        const eventsToday = upcoming.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.toDateString() === today.toDateString();
        });

        const eventsTomorrow = upcoming.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.toDateString() === tomorrow.toDateString();
        });

        const eventsThisWeek = upcoming.filter(event => {
            const endDate = event.endDate ? new Date(event.endDate) : new Date(event.date);
            return endDate >= today && endDate <= endOfWeek;
        });

        const eventsThisMonth = upcoming.filter(event => {
            const endDate = event.endDate ? new Date(event.endDate) : new Date(event.date);
            return endDate >= today && endDate <= endOfMonth;
        });

        const eventsNextWeek = upcoming.filter(event => {
           const endDate = event.endDate ? new Date(event.endDate) : new Date(event.date);
           return endDate >= startOfNextWeek && endDate <= endOfNextWeek;
        });

        function appendEvents(title, eventsArray) {
            if (eventsArray.length > 0) {
                const sectionTitle = document.createElement('h3');
                sectionTitle.textContent = title;
                upcomingEventsList.appendChild(sectionTitle);

                eventsArray.sort((a, b) => new Date(a.date) - new Date(b.date));
                eventsArray.slice(0, 5).forEach(event => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${event.title} - ${formatDate(event.date)} ${event.endDate ? ' - ' + formatDate(event.endDate) : ''}`;
                    upcomingEventsList.appendChild(listItem);
                });
            }
        }

        appendEvents("Hoje", eventsToday);
        appendEvents("Amanhã", eventsTomorrow);
        appendEvents("Esta Semana", eventsThisWeek);
        appendEvents("Este Mês", eventsThisMonth);
        appendEvents("Próxima Semana", eventsNextWeek);
    }

    addEventButton.addEventListener('click', () => {
        const date = eventDateInput.value;
        const endDate = eventEndDateInput.value;
        const title = eventTitleInput.value;
        const email = eventEmailInput.value;

        if (date && title && isValidDate(date)) {
            let newEvent = {
                date: date,
                title: title,
            };
            if (endDate && isValidDate(endDate)) {
                newEvent.endDate = endDate;
            } else {
                newEvent.endDate = date;
            }
            newEvent.daysOfWeek = [];
            if (email) {
                newEvent.email = email;
            }

            events.push(newEvent);
            renderCalendar();
            displayEvents();
            displayUpcomingEvents();

            eventDateInput.value = '';
            eventEndDateInput.value = '';
            eventTitleInput.value = '';
            eventEmailInput.value = '';
        } else {
            alert('Por favor, preencha todos os campos com uma data válida.');
        }
    });

    function clearSelectedDate() {
        selectedDate = null;
        const selectedDayElement = document.querySelector('.calendar-grid div.selected');
        if (selectedDayElement) selectedDayElement.classList.remove('selected');
    }
    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        selectedDate = null;
        renderCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        selectedDate = null;
        renderCalendar();
    });
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            const tabId = button.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });

    renderCalendar();
    displayEvents();
    displayUpcomingEvents();
});