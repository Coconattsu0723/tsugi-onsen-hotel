const form = document.querySelector('#reservation-form');
const { arrival, departure, guests, room } = form.elements;
const summary = document.querySelector('#reservation-summary');

function updateOptions() {
  const nextDay = new Date(arrival.valueAsNumber + 86400000);
  departure.min = arrival.value ? nextDay.toISOString().slice(0, 10) : '';
  for (const option of room.options) {
    option.disabled = guests.value === '3' && ['garden', 'river'].includes(option.value);
  }
  if (room.selectedOptions[0]?.disabled) room.value = '';
  summary.textContent = '';
}

const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
arrival.min = today.toISOString().slice(0, 10);
form.addEventListener('change', updateOptions);
form.addEventListener('submit', (event) => {
  event.preventDefault();
  summary.textContent = `${arrival.value}から${departure.value}まで、${guests.value}名、${room.selectedOptions[0].textContent}。入力内容を確認しました。`;
});
updateOptions();

form.querySelector("button[type=submit]").disabled = false;
