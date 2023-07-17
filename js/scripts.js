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
	const modalCloseBtn = document.querySelector('[data-close]')

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

	modalCloseBtn.addEventListener('click', closeModal)

	modal.addEventListener('click', event => {
		if (event.target === modal) {
			closeModal()
		}
	})

	document.addEventListener('keydown', event => {
		if (event.code === 'Escape' && modal.classList.contains('show')) {
			closeModal()
		}
	})

	const modalTimerId = setTimeout(openModal, 5000)

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

	const menuCardsDB = [
		{
			src: 'img/tabs/vegy.jpg',
			alt: 'vegy',
			title: 'Меню "Фитнес"',
			descr:
				'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
			price: 9,
			selector: '.menu .container',
		},
		{
			src: 'img/tabs/elite.jpg',
			alt: 'elite',
			title: 'Меню “Премиум”',
			descr:
				'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
			price: 21,
			selector: '.menu .container',
		},
		{
			src: 'img/tabs/post.jpg',
			alt: 'post',
			title: 'Меню "Постное"',
			descr:
				'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
			price: 14,
			selector: '.menu .container',
		},
	]

	menuCardsDB.forEach(card => {
		new MenuCard(
			card.src,
			card.alt,
			card.title,
			card.descr,
			card.price,
			card.selector,
			card.classes
		).render()
	})

	// Forms

	const forms = document.querySelectorAll('form')

	const message = {
		loading: 'Загрузка',
		success: 'Спасибо! Скоро мы с Вами свяжемся',
		failure: 'Что-то пошло не так...',
	}

	forms.forEach(item => {
		postData(item)
	})

	function postData(form) {
		form.addEventListener('submit', event => {
			event.preventDefault()

			const statusMessage = document.createElement('div')
			statusMessage.classList.add('status')
			statusMessage.textContent = message.loading
			form.append(statusMessage)

			const request = new XMLHttpRequest()
			request.open('POST', 'server.php')

			request.setRequestHeader('Content-type', 'application/json')
			const formData = new FormData(form)

			const object = {}
			formData.forEach(function(value, key) {
				object[key] = value
			})

			const json = JSON.stringify(object)

			request.send(json)

			request.addEventListener('load', () => {
				if (request.status === 200) {
					console.log(request.response)
					statusMessage.textContent = message.success
					form.reset()
					setTimeout(() => {
						statusMessage.remove()
					}, 2000)
				} else {
					statusMessage.textContent = message.failure
				}
			})
		})
	}
})
