const carState = localStorage.getItem('carState') || 'stopped';
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const speedControl = document.getElementById('speed-control');

function updateCarState(newState) {
  localStorage.setItem('carState', newState);
  if (newState === 'running') {
    startButton.classList.add('hidden');
    stopButton.classList.remove('hidden');
  } else {
    startButton.classList.remove('hidden');
    stopButton.classList.add('hidden');
  }
}

const joystickStatic = nipplejs.create({
  zone: document.getElementById('joystick'),
  mode: 'static',
  position: { left: '80%', top: '75%' },
  color: 'var(--primary)',
});

joystickStatic
  .on('start end', function (evt, data) {
    // المحاور التي تحتاجها
    console.log(data);
  })
  .on('move', function (evt, data) {
    // تنفيذ الأوامر هنا
    console.log(data);
  });

// Event listener for the speed control

// Event listeners for start/stop buttons
startButton.addEventListener('click', function () {
  updateCarState('running');
});

stopButton.addEventListener('click', function () {
  updateCarState('stopped');
});

updateCarState(carState);

// ////////////////////////////
function drawMy(value) {
  const speedValue = document.getElementById('speedValue');
  const wrapper = document.querySelector('.progress');
  const barCount = 50;
  const percent1 = (value / 100) * barCount;

  if (value < 0) {
    return;
  }
  speedValue.innerText = parseInt((value * 480) / 100) + ' km';
  while (wrapper.children.length < barCount) {
    const i = document.createElement('i');
    i.style.setProperty('--i', wrapper.children.length);
    wrapper.appendChild(i);
  }

  for (let index = 0; index < barCount; index++) {
    const bar = wrapper.children[index];
    const segmentValue = index / barCount;

    if (segmentValue <= 0.33) {
      bar.dataset.value = 'low';
    } else if (segmentValue <= 0.66) {
      bar.dataset.value = 'medium';
    } else {
      bar.dataset.value = 'high';
    }

    // Update class based on filled value
    if (index < percent1) {
      bar.classList.add('selected1');
    } else {
      bar.classList.remove('selected1');
    }
  }
}

// ////////////////////////////////////////////////////////////////

const throttle = document.getElementById('throttle');
const maxSpeed = 480; // Maximum speed in km/h
let speed = null;
let intervalId = null;
let newPosition = null;

function handleDrag(event) {
  const rect = speedControl.getBoundingClientRect();
  newPosition = event.clientX - rect.left - throttle.offsetWidth / 2;
  newPosition = Math.max(
    0,
    Math.min(newPosition, rect.width - throttle.offsetWidth)
  );
  throttle.style.left = `${newPosition}px`;

  speed = Math.round(
    (newPosition / (rect.width - throttle.offsetWidth)) * maxSpeed
  );
  const percentage = (speed / maxSpeed) * 100;
  // هاي النسبة يلي بدك ياها مشان السرعة
  console.log(percentage);
  drawMy(percentage);
  const speedValue = document.getElementById('speedValue');
  speedValue.style.filter = 'blur(0px)';
}

function decreaseSpeedGradually() {
  if (speed > 0) {
    const speedDecrease = 5; // تقليل السرعة بمقدار 5 كم/ساعة
    speed -= speedDecrease;
    const rect = speedControl.getBoundingClientRect();
    const throttlePosition = parseInt(throttle.style.left, 10);
    const newPosition =
      throttlePosition - (speedDecrease / maxSpeed) * rect.width;
    throttle.style.left = `${Math.max(0, newPosition)}px`;

    // update perecent
    const percentage = (speed / maxSpeed) * 100;
    drawMy(percentage - 5); // تحديث عرض السرعة
  } else {
    clearInterval(intervalId); // إيقاف التقليل عندما تصل السرعة إلى الصفر
    intervalId = null;
    throttle.style.left = `0px`;
    const percentage = 0;
    drawMy(percentage); // تحديث عرض السرعة
    const speedValue = document.getElementById('speedValue');
    speedValue.style.filter = 'blur(1px)';
  }
}

throttle.addEventListener('mousedown', function (event) {
  event.preventDefault();
  if (intervalId !== null) {
    clearInterval(intervalId); // إيقاف التقليل التدريجي إذا كان نشطًا
  }
  document.addEventListener('mousemove', handleDrag);
});

document.addEventListener('mouseup', function () {
  document.removeEventListener('mousemove', handleDrag);
  intervalId = setInterval(decreaseSpeedGradually, 100); // بدء التقليل التدريجي
});

// Your existing drawMy function should remain unchanged
drawMy(0);
