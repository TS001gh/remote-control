const carState = localStorage.getItem('carState') || 'stopped';
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const speedControl = document.getElementById('speed-control');
const wrapper = document.querySelector('.progress');
const container = document.querySelector('.container');

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
let speed = 0;
let intervalId = null;

// تعديل هذه الوظيفة للتعامل مع أحداث اللمس
function handleDrag(event) {
  // تحقق إذا كان الحدث هو حدث لمس واستخدمه إذا كان الأمر كذلك
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;

  const rect = speedControl.getBoundingClientRect();
  let newPosition = clientX - rect.left - throttle.offsetWidth / 2;
  newPosition = Math.max(
    0,
    Math.min(newPosition, rect.width - throttle.offsetWidth)
  );
  throttle.style.left = `${newPosition}px`;

  speed = Math.round(
    (newPosition / (rect.width - throttle.offsetWidth)) * maxSpeed
  );
  const percentage = (speed / maxSpeed) * 100;
  console.log(percentage);

  // هاي مهمة بالنسبة لالك يلي هي نسبة السرعة فينك تطبعها وتشوفها عن طريق ال console.log(percentage)
  drawMy(percentage);

  const speedValue = document.getElementById('speedValue');
  speedValue.textContent = `${speed}km`;
  speedValue.style.filter = 'blur(0px)';
}

throttle.addEventListener('mousedown', function (event) {
  event.preventDefault();
  document.addEventListener('mousemove', handleDrag);
});

document.addEventListener('mouseup', function () {
  document.removeEventListener('mousemove', handleDrag);
});

throttle.addEventListener('touchstart', function (event) {
  event.preventDefault();
  document.addEventListener('touchmove', handleDrag, { passive: false });
});

document.addEventListener('touchend', function () {
  document.removeEventListener('touchmove', handleDrag);
});

drawMy(0);

let wasLandscape = window.innerWidth > window.innerHeight;

window.addEventListener('resize', function () {
  const isLandscape = window.innerWidth > window.innerHeight;

  if (isLandscape) {
    speedControl.style.scale = '0.7';
    wrapper.style.scale = '0.7';
    document.querySelector('.speed').style.gap = '2rem';
    document.querySelector('.speed').style.marginTop = '-4rem';
    document.querySelector('.controls').style.gap = '2rem';
    document.querySelector('.controls').style.marginTop = '-4rem';
    container.style.flexDirection = 'row';
  } else if (wasLandscape) {
    location.reload();
  }

  wasLandscape = isLandscape;
});
