window.addEventListener('DOMContentLoaded', () => {
	// Tabs

	const tabs = document.querySelectorAll('.tabheader__item')
	const tabsContent = document.querySelectorAll('.tabcontent')
	const tabsParent = document.querySelector('.tabheader__items')

	function hideTabContent() {
		tabsContent.forEach(item => {
			item.classList.add('hide')
			item.classList.remove('show', 'fade')
		})

		tabs.forEach(item => {
			item.classList.remove('tabheader__item_active')
		})
	}

	function showTabContent(i = 0) {
		tabsContent[i].classList.add('show', 'fade')
		tabsContent[i].classList.remove('hide')
		tabs[i].classList.add('tabheader__item_active')
	}

	hideTabContent()
	showTabContent()

	tabsParent.addEventListener('click', event => {
		const target = event.target
		if (target && target.classList.contains('tabheader__item')) {
			tabs.forEach((item, i) => {
				if (target == item) {
					hideTabContent()
					showTabContent(i)
				}
			})
		}
	})

	// Timer

	const deadline = '2023-08-01'

	function setEndDate(endDate) {
		const deadline = new Date(endDate).toLocaleDateString('ru', {
			day: 'numeric',
			month: 'long',
		})

		return deadline
	}

	function getTimeRemaining(endTime) {
		const t = Date.parse(endTime) - Date.parse(new Date())
		const days = Math.floor(t / (1000 * 60 * 60 * 24))
		const hours = Math.floor((t / (1000 * 60 * 60)) % 24)
		const minutes = Math.floor((t / (1000 * 60)) % 60)
		const seconds = Math.floor((t / 1000) % 60)

		return {
			total: t,
			days: days,
			hours: hours,
			minutes: minutes,
			seconds: seconds,
		}
	}

	function getZero(num) {
		if (num >= 0 && num < 10) {
			return `0${num}`
		} else {
			return num
		}
	}

	function setClock(selector, endTime) {
		document.querySelector('#deadline').innerHTML = setEndDate(endTime)

		const timer = document.querySelector(selector)
		const days = timer.querySelector('#days')
		const hours = timer.querySelector('#hours')
		const minutes = timer.querySelector('#minutes')
		const seconds = timer.querySelector('#seconds')
		const timeInterval = setInterval(updateClock, 1000)

		updateClock()

		function updateClock() {
			const t = getTimeRemaining(endTime)
			days.innerHTML = getZero(t.days)
			hours.innerHTML = getZero(t.hours)
			minutes.innerHTML = getZero(t.minutes)
			seconds.innerHTML = getZero(t.seconds)

			if (t.total <= 0) {
				clearInterval(timeInterval)
			}
		}
	}

	setClock('.timer', deadline)

	// Modal

	const modalTrigger = document.querySelectorAll('[data-modal]')
	const modal = document.querySelector('.modal')

	function openModal() {
		modal.classList.add('show')
		modal.classList.remove('hide')
		document.body.style.overflow = 'hidden'
		clearInterval(modalTimerId)
	}

	function closeModal() {
		modal.classList.add('hide')
		modal.classList.remove('show')
		document.body.style.overflow = ''
	}

	modalTrigger.forEach(btn => {
		btn.addEventListener('click', openModal)
	})

	modal.addEventListener('click', event => {
		if (
			event.target === modal ||
			event.target.getAttribute('data-close') == ''
		) {
			closeModal()
		}
	})

	document.addEventListener('keydown', event => {
		if (event.code === 'Escape' && modal.classList.contains('show')) {
			closeModal()
		}
	})

	const modalTimerId = setTimeout(openModal, 30000)

	function showModalByScroll() {
		if (
			window.scrollY + document.documentElement.clientHeight >=
			document.documentElement.scrollHeight
		) {
			openModal()
			window.removeEventListener('scroll', showModalByScroll)
		}
	}

	window.addEventListener('scroll', showModalByScroll)

	// Використовування класів для карточек товарів

	class MenuCard {
		constructor(src, alt, title, descr, price, parentSelector, ...classes) {
			this.src = src
			this.alt = alt
			this.title = title
			this.descr = descr
			this.price = price
			this.classes = classes
			this.parent = document.querySelector(parentSelector)
			this.transfer = 36.65
			this.changeToUAH()
		}

		changeToUAH() {
			this.price = Math.ceil(this.price * this.transfer)
		}

		render() {
			const element = document.createElement('div')
			this.element = 'menu__item'

			if (this.classes.length === 0) {
				element.classList.add(this.element)
			} else {
				let classNames = this.element + this.classes
				element.classList.add(classNames)
			}

			element.innerHTML = `
				<img src=${this.src} alt=${this.alt}>
				<h3 class="menu__item-subtitle">${this.title}</h3>
				<div class="menu__item-descr">${this.descr}</div>
				<div class="menu__item-divider"></div>
				<div class="menu__item-price">
					<div class="menu__item-cost">Цена:</div>
					<div class="menu__item-total"><span>${this.price}</span> грн/день</div>
				</div>
			`
			this.parent.append(element)
		}
	}

	const getResource = async url => {
		const res = await fetch(url)

		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`)
		}

		return res.json()
	}

	getResource('http://localhost:3000/menu').then(data => {
		data.forEach(({ img, altimg, title, descr, price }) => {
			new MenuCard(
				img,
				altimg,
				title,
				descr,
				price,
				'.menu .container'
			).render()
		})
	})

	// Forms

	const forms = document.querySelectorAll('form')

	const message = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо! Скоро мы с Вами свяжемся',
		failure: 'Что-то пошло не так...',
	}

	forms.forEach(item => {
		bindPostData(item)
	})

	const postData = async (url, data) => {
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=utf-8',
			},
			body: data,
		})

		return res.json()
	}

	function bindPostData(form) {
		form.addEventListener('submit', event => {
			event.preventDefault()

			let statusMessage = document.createElement('img')
			statusMessage.src = message.loading
			statusMessage.style.cssText = `
				display: block;
				margin: 0 auto;
			`
			form.insertAdjacentElement('afterend', statusMessage)

			const formData = new FormData(form)

			const json = JSON.stringify(Object.fromEntries(formData.entries()))

			postData('http://localhost:3000/requests', json)
				.then(data => {
					console.log(data)
					showThanksModal(message.success)
					statusMessage.remove()
				})
				.catch(() => {
					showThanksModal(message.failure)
				})
				.finally(() => {
					form.reset()
				})
		})
	}

	function showThanksModal(message) {
		const prevModalDialog = document.querySelector('.modal__dialog')

		prevModalDialog.classList.add('hide')
		openModal()

		const thanksModal = document.createElement('div')
		thanksModal.classList.add('modal__dialog')
		thanksModal.innerHTML = `
			<div class="modal__content">
				<div class="modal__close" data-close>&times;</div>
				<div class="modal__title">${message}</div>	
			</div>
		`

		document.querySelector('.modal').append(thanksModal)
		setTimeout(() => {
			thanksModal.remove()
			prevModalDialog.classList.add('show')
			prevModalDialog.classList.remove('hide')
			closeModal()
		}, 4000)
	}

	// Slider

	const slidesWrapper = document.querySelector('.offer__slider-wrapper')
	const slidesField = slidesWrapper.querySelector('.offer__slider-inner')
	const slides = slidesField.querySelectorAll('.offer__slide')
	const slider = document.querySelector('.offer__slider')
	const prev = slider.querySelector('.offer__slider-prev')
	const next = slider.querySelector('.offer__slider-next')
	const total = slider.querySelector('#total')
	const current = slider.querySelector('#current')
	const width = window.getComputedStyle(slidesWrapper).width

	let slideIndex = 1
	let offset = 0

	if (slides.length < 10) {
		total.textContent = `0${slides.length}`
		current.textContent = `0${slideIndex}`
	} else {
		total.textContent = slides.length
		current.textContent = slideIndex
	}

	slidesField.style.width = 100 * slides.length + '%'
	slidesField.style.display = 'flex'
	slidesField.style.transition = '0.5s all'

	slidesWrapper.style.overflow = 'hidden'

	slides.forEach(slide => {
		slide.style.width = width
	})

	slider.style.position = 'relative'

	const indicators = document.createElement('ol')
	const dots = []
	indicators.classList.add('carousel-indicators')

	for (let i = 0; i < slides.length; i++) {
		const dot = document.createElement('li')
		dot.setAttribute('data-slide-to', i + 1)
		dot.classList.add('dot')

		if (i == 0) {
			dot.classList.add('dot_active')
		}

		indicators.append(dot)
		dots.push(dot)
	}

	slider.append(indicators)

	const activeDot = index => {
		dots.forEach(dot => dot.classList.remove('dot_active'))
		dots[index].classList.add('dot_active')
	}

	const currentNumConversion = () => {
		if (slides.length < 10) {
			current.textContent = `0${slideIndex}`
		} else {
			current.textContent = slideIndex
		}
	}

	const deleteNotDigits = str => +str.replace(/\D/g, '')

	next.addEventListener('click', () => {
		if (offset == deleteNotDigits(width) * (slides.length - 1)) {
			offset = 0
		} else {
			offset += deleteNotDigits(width)
		}

		slidesField.style.transform = `translateX(-${offset}px)`

		if (slideIndex == slides.length) {
			slideIndex = 1
		} else {
			slideIndex++
		}

		currentNumConversion()

		activeDot(slideIndex - 1)
	})

	prev.addEventListener('click', () => {
		if (offset == 0) {
			offset = deleteNotDigits(width) * (slides.length - 1)
		} else {
			offset -= deleteNotDigits(width)
		}

		slidesField.style.transform = `translateX(-${offset}px)`

		if (slideIndex == 1) {
			slideIndex = slides.length
		} else {
			slideIndex--
		}

		currentNumConversion()

		activeDot(slideIndex - 1)
	})

	dots.forEach(dot => {
		dot.addEventListener('click', event => {
			const slideTo = event.target.getAttribute('data-slide-to')

			slideIndex = slideTo
			offset = deleteNotDigits(width) * (slideTo - 1)

			slidesField.style.transform = `translateX(-${offset}px)`

			currentNumConversion()

			activeDot(slideIndex - 1)
		})
	})

	// Calc

	const result = document.querySelector('.calculating__result span')
	let sex, height, weight, age, ratio

	if (localStorage.getItem('sex')) {
		sex = localStorage.getItem('sex')
	} else {
		sex = 'femail'
		localStorage.setItem('sex', 'femail')
	}

	if (localStorage.getItem('ratio')) {
		ratio = localStorage.getItem('ratio')
	} else {
		ratio = 1.375
		localStorage.setItem('ratio', 1.375)
	}

	function initLocalSettings(selector, activeClass) {
		const elements = document.querySelectorAll(selector)

		elements.forEach(elem => {
			elem.classList.remove(activeClass)
			if (elem.getAttribute('id') === localStorage.getItem('sex')) {
				elem.classList.add(activeClass)
			}
			if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
				elem.classList.add(activeClass)
			}
		})
	}

	initLocalSettings('#gender div', 'calculating__choose-item_active')
	initLocalSettings(
		'.calculating__choose_big div',
		'calculating__choose-item_active'
	)

	function calcTotal() {
		if (!sex || !height || !weight || !age || !ratio) {
			result.textContent = 0
			return
		}

		if (sex === 'femail') {
			result.textContent = Math.round(
				(447.6 + 9.2 * weight + 3.1 * height - 4.3 * age) * ratio
			)
		} else {
			result.textContent = Math.round(
				(88.36 + 13.4 * weight + 4.8 * height - 5.7 * age) * ratio
			)
		}
	}

	calcTotal()

	function getStaticInformation(selector, activeClass) {
		const elements = document.querySelectorAll(selector)

		elements.forEach(elem => {
			elem.addEventListener('click', event => {
				if (event.target.getAttribute('data-ratio')) {
					ratio = +event.target.getAttribute('data-ratio')
					localStorage.setItem(
						'ratio',
						+event.target.getAttribute('data-ratio')
					)
				} else {
					sex = event.target.getAttribute('id')
					localStorage.setItem('sex', event.target.getAttribute('id'))
				}

				elements.forEach(elem => {
					elem.classList.remove(activeClass)
				})

				event.target.classList.add(activeClass)
				calcTotal()
			})
		})
	}

	getStaticInformation('#gender div', 'calculating__choose-item_active')
	getStaticInformation(
		'.calculating__choose_big div',
		'calculating__choose-item_active'
	)

	function getDynamicInformation(selector) {
		const input = document.querySelector(selector)

		input.addEventListener('input', () => {
			if (input.value.match(/\D/g)) {
				input.style.border = '1px solid red'
			} else {
				input.style.border = 'none'
			}

			switch (input.getAttribute('id')) {
				case 'height':
					height = +input.value
					break
				case 'weight':
					weight = +input.value
					break
				case 'age':
					age = +input.value
					break
			}
			calcTotal()
		})
	}

	getDynamicInformation('#height')
	getDynamicInformation('#weight')
	getDynamicInformation('#age')
})
