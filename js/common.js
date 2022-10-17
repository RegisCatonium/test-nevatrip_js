document.addEventListener('DOMContentLoaded', function() {

	const route = document.querySelector('#route')
	const infoProduct = document.querySelector('#total')
	const price = infoProduct.querySelector('#price')
	const tickets = infoProduct.querySelector('#tickets')
	const rt = infoProduct.querySelector('#rt')
	const dispatch = infoProduct.querySelector('#dispatch')
	const arrival = infoProduct.querySelector('#arrival')
	const blockAB = document.querySelector('#timeAB')
	const blockBA = document.querySelector('#timeBA')

	document.querySelector('#btn-count').onclick = function(e) {
		e.preventDefault()
		createInfo()
	}

	function createInfo() {
		let routeValue = route.value
		let num = document.querySelector('#num').value
		let pr = 0 // стоимость билета
		let dispatchTime = 0 // время отправки
		let arrivalTime = 0 // время прибытия
		if (routeValue == 1) {
			pr = 700
			str = 'из A в B'
		}
		if (routeValue == 2) {
			pr = 700
			str = 'из A в B'
		}
		if (routeValue == 3) {
			pr = 1200
			str = 'из A в B и обратно в A'
		}

		console.log(dispatchTime)

		dispatchTime = new Date(+blockAB.value)
		arrivalTime = new Date(+blockAB.value + 50 * 6e4)

		let total = pr * num
		
		price.innerHTML = total + ' ₽'
		tickets.innerHTML = num + ` ${declOfNum(num, ['билет', 'билета', 'билетов'])}`
		rt.innerHTML = str 
		dispatch.innerHTML = `${formatTime(dispatchTime.getHours())}:${formatTime(dispatchTime.getMinutes())}`
		arrival.innerHTML = `${formatTime(arrivalTime.getHours())}:${formatTime(arrivalTime.getMinutes())}`

		infoProduct.classList.remove('hidden')

		if (route == 0 || num <= 0) {
			infoProduct.classList.add('hidden')
			alert('Заполните все поля')
			return
		}
	}

	// числительные окончания
	function declOfNum(number, titles) {
		cases = [2, 0, 1, 1, 1, 2]
		return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
	}

	const timesAB = ['2021-08-21 18:00:00',
						  '2021-08-21 18:30:00',
						  '2021-08-21 18:45:00',
						  '2021-08-21 19:00:00',
						  '2021-08-21 19:15:00',
						  '2021-08-21 21:00:00'
	]
	const timesBA = ['2021-08-21 18:30:00',
						  '2021-08-21 18:45:00',
						  '2021-08-21 19:00:00',
						  '2021-08-21 19:15:00',
						  '2021-08-21 19:35:00',
						  '2021-08-21 21:50:00',
						  '2021-08-21 21:55:00'
	]

	const parseTimes = times => times.map(el => new Date(el.trim()))

	const datesAB = parseTimes(timesAB);
	const datesBA = parseTimes(timesBA);

	const offsetTime = ((new Date()).getTimezoneOffset() + 180) * 6e4 // смещение времени
	const formatTime = el => el.toString().padStart(2, '0') // форматирование времени в виду 20:30

	// создание опций в селекте
	function createOption(datesArr, block) {
		datesArr.forEach(time => {
			const option = document.createElement('option')
			let localTime = new Date(+time - offsetTime) // локальное время

			// option.value = time.getTime()
			option.value = localTime.getTime()
			// option.innerText = `${formatTime(time.getHours())}:${formatTime(time.getMinutes())}`
			option.innerText = `${formatTime(localTime.getHours())}:${formatTime(localTime.getMinutes())}`
			block.appendChild(option)
		})
	}

	createOption(datesAB, blockAB)
	createOption(datesBA, blockBA)

	function changeRout() {
		let routeValue = route.value

		if (routeValue == 1){
			blockAB.classList.remove('hidden')
			blockBA.classList.add('hidden')
		}
		if (routeValue == 2){
			blockAB.classList.add('hidden')
			blockBA.classList.remove('hidden')
		}
		if (routeValue == 3){
			blockAB.classList.remove('hidden')
			blockBA.classList.remove('hidden')
		}
	}

	function filterOption() {
		let limit = 0
		if (route.value == 3) {
			limit = +blockAB.value + 50 * 6e4
		}

		let valid = +blockAB.value >= limit
		let fix = false

		blockBA.querySelectorAll('option').forEach(el =>{
			if (+el.value < limit) {
				el.setAttribute('disabled', 'disabled')
			} else {
				el.removeAttribute('disabled')
				if (!valid && !fix) {
					blockBA.value = el.value
					fix = true
				}
			}
		})
	}

	const update = () => (changeRout(), filterOption())

	route.addEventListener('change', update)
	blockAB.addEventListener('change', update)
	blockBA.addEventListener('change', update)

})

